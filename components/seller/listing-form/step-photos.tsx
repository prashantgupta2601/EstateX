'use client';

import React, { useState, useCallback } from 'react';
import { UseFormSetValue, UseFormWatch, FieldErrors, UseFormTrigger } from 'react-hook-form';
import { ChevronRight, ChevronLeft, Image as ImageIcon, Trash2, Camera, Sparkles, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/toast';
import Image from 'next/image';
import { useDropzone, FileRejection } from 'react-dropzone';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  rectSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { ListingFormValues } from '@/lib/validations/listing-form';

interface StepPhotosProps {
  setValue: UseFormSetValue<ListingFormValues>;
  watch: UseFormWatch<ListingFormValues>;
  errors: FieldErrors<ListingFormValues>;
  trigger: UseFormTrigger<ListingFormValues>;
  onNext: () => void;
  onBack: () => void;
}

interface ImageFile {
  id: string;
  url: string;
  name: string;
  size: number;
}

const sampleImages = [
  'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80'
];

export default function StepPhotos({
  setValue,
  watch,
  errors,
  trigger,
  onNext,
  onBack
}: StepPhotosProps) {
  const images = watch('photosDetails.images') || [];
  
  // Local state to keep track of file metadata (for DnD kit IDs + names + sizes)
  const [imageFiles, setImageFiles] = useState<ImageFile[]>(() => {
    return images.map((url, idx) => ({
      id: `img-${idx}-${Date.now()}`,
      url,
      name: url.startsWith('http') ? `sample-image-${idx + 1}.jpg` : 'uploaded-image.jpg',
      size: url.startsWith('http') ? 1572864 : 838860, // 1.5MB vs 800KB mock size
    }));
  });

  // Simulated upload progress state
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<{ [id: string]: number }>({});

  const handleUseSamples = () => {
    const newFiles = sampleImages.map((url, idx) => ({
      id: `sample-${idx}-${Date.now()}`,
      url,
      name: `sample-image-${idx + 1}.jpg`,
      size: 1572864, // 1.5 MB
    }));
    setImageFiles(newFiles);
    setValue('photosDetails.images', newFiles.map(f => f.url), { shouldValidate: true });
    toast('Sample photos loaded successfully!', 'success');
  };

  const handleRemovePhoto = useCallback((id: string) => {
    setImageFiles((prev) => {
      const updated = prev.filter((f) => f.id !== id);
      setValue('photosDetails.images', updated.map(f => f.url), { shouldValidate: true });
      return updated;
    });
  }, [setValue]);

  // react-dropzone config
  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (imageFiles.length + acceptedFiles.length > 20) {
      toast('You can upload up to 20 images maximum.', 'error');
      return;
    }

    const newFiles = acceptedFiles.map((file, idx) => ({
      id: `file-${idx}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      url: URL.createObjectURL(file),
      name: file.name,
      size: file.size,
    }));

    setImageFiles((prev) => {
      const updated = [...prev, ...newFiles];
      setValue('photosDetails.images', updated.map(f => f.url), { shouldValidate: true });
      return updated;
    });

    toast(`Added ${acceptedFiles.length} photos.`, 'success');
  }, [imageFiles, setValue]);

  const onDropRejected = useCallback((fileRejections: FileRejection[]) => {
    fileRejections.forEach((rejection) => {
      const { errors } = rejection;
      if (errors[0]?.code === 'file-too-large') {
        toast(`File is too large. Max size is 5MB.`, 'error');
      } else if (errors[0]?.code === 'file-invalid-type') {
        toast(`Unsupported file type. Accepts JPG, PNG, WEBP only.`, 'error');
      } else {
        toast(errors[0]?.message || 'File upload failed.', 'error');
      }
    });
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    onDropRejected,
    accept: {
      'image/jpeg': ['.jpeg', '.jpg'],
      'image/png': ['.png'],
      'image/webp': ['.webp'],
    },
    maxSize: 5 * 1024 * 1024, // 5MB
    maxFiles: 20,
  });

  // dnd-kit sensors configuration
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8, // prevents dragging triggers on simple clicks
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      setImageFiles((items) => {
        const oldIndex = items.findIndex((item) => item.id === active.id);
        const newIndex = items.findIndex((item) => item.id === over.id);
        const updated = arrayMove(items, oldIndex, newIndex);
        setValue('photosDetails.images', updated.map((f) => f.url), { shouldValidate: true });
        // The first image (index 0) becomes the cover
        setValue('photosDetails.coverIndex', 0, { shouldValidate: true });
        return updated;
      });
    }
  };

  // Upload simulation progress
  // TODO: In a production environment, this would upload binary files to Cloudinary/S3
  // and populate form values with returned public URLs.
  const simulateUploads = () => {
    setUploading(true);
    const initialProgress: { [id: string]: number } = {};
    imageFiles.forEach((f) => {
      initialProgress[f.id] = 0;
    });
    setUploadProgress(initialProgress);

    let completedCount = 0;

    imageFiles.forEach((file) => {
      let progress = 0;
      const interval = setInterval(() => {
        progress += Math.floor(Math.random() * 15) + 5;
        if (progress >= 100) {
          progress = 100;
          clearInterval(interval);
          completedCount++;

          if (completedCount === imageFiles.length) {
            setTimeout(() => {
              setUploading(false);
              onNext();
            }, 600);
          }
        }
        setUploadProgress((prev) => ({
          ...prev,
          [file.id]: progress,
        }));
      }, 120 + Math.random() * 100);
    });
  };

  const handleNext = async () => {
    const isValid = await trigger('photosDetails');
    if (isValid) {
      simulateUploads();
    } else {
      toast('Please upload at least 3 photos before proceeding.', 'error');
    }
  };

  return (
    <div className="flex flex-col gap-5 py-2 animate-in fade-in duration-300 relative">
      
      <div className="flex items-center justify-between border-b border-border/25 pb-2.5 select-none">
        <div className="flex items-center gap-2 text-xs font-bold text-muted-foreground uppercase tracking-wider">
          <Camera className="h-4.5 w-4.5 text-primary" />
          <span>Upload Property Photos</span>
        </div>
        {imageFiles.length === 0 && (
          <button 
            type="button"
            onClick={handleUseSamples}
            className="text-[10px] font-black uppercase text-primary hover:underline flex items-center gap-1.5 cursor-pointer"
          >
            <Sparkles className="h-3.5 w-3.5 fill-primary/10" />
            <span>Use Sample Photos</span>
          </button>
        )}
      </div>

      {/* Drag & Drop Upload Zone */}
      <div 
        {...getRootProps()}
        className={`border-2 border-dashed rounded-2xl p-8 flex flex-col items-center justify-center text-center gap-3 cursor-pointer transition-all select-none ${
          isDragActive 
            ? 'border-primary bg-primary/5 ring-4 ring-primary/10' 
            : 'border-border/80 bg-muted/10 hover:bg-muted/20 hover:border-border'
        }`}
      >
        <input {...getInputProps()} />
        <ImageIcon className={`h-8 w-8 transition-transform ${isDragActive ? 'scale-110 text-primary' : 'text-muted-foreground/80'}`} />
        <div className="flex flex-col gap-0.5">
          <span className="text-xs font-bold text-foreground">
            {isDragActive ? 'Drop the files here...' : 'Drag & drop photos here, or click to browse'}
          </span>
          <p className="text-[10px] text-muted-foreground max-w-xs leading-relaxed mt-0.5">
            Add at least 3 high-quality shots. Accepts JPG, PNG, WEBP (max 5MB per file, up to 20 images).
          </p>
        </div>
      </div>

      {errors.photosDetails?.images && (
        <span className="text-[11px] text-destructive font-bold text-center mt-1">
          {errors.photosDetails.images.message}
        </span>
      )}

      {/* Drag-to-reorder Previews Grid */}
      {imageFiles.length > 0 && (
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <div className="flex flex-col gap-2 mt-2">
            <div className="text-left select-none mb-1">
              <h4 className="text-xs font-black text-foreground">Property Images ({imageFiles.length})</h4>
              <p className="text-[9px] text-muted-foreground mt-0.5">Drag photos to reorder. The first photo is your main cover photo.</p>
            </div>
            
            <SortableContext items={imageFiles.map(f => f.id)} strategy={rectSortingStrategy}>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 animate-in zoom-in-95 duration-200">
                {imageFiles.map((file, idx) => (
                  <SortableItem
                    key={file.id}
                    file={file}
                    isCover={idx === 0}
                    onRemove={handleRemovePhoto}
                  />
                ))}
              </div>
            </SortableContext>
          </div>
        </DndContext>
      )}

      {/* Footer navigation */}
      <div className="flex justify-between pt-4 border-t border-border/25 mt-4">
        <Button 
          type="button" 
          variant="ghost"
          onClick={onBack}
          className="rounded-xl border border-border/80 h-10 font-bold text-xs cursor-pointer px-4"
        >
          <ChevronLeft className="h-4.5 w-4.5 mr-1" />
          <span>Back</span>
        </Button>
        <Button 
          type="button" 
          onClick={handleNext}
          className="rounded-xl bg-primary hover:bg-primary/95 text-primary-foreground font-bold px-6 h-10 text-xs flex items-center gap-1.5 cursor-pointer shadow-xs border-none"
        >
          <span>Next Step</span>
          <ChevronRight className="h-4.5 w-4.5" />
        </Button>
      </div>

      {/* Simulated Upload Progress Overlay */}
      {uploading && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-md animate-in fade-in duration-300">
          <div className="bg-background border border-border rounded-2xl p-6 w-full max-w-md shadow-2xl flex flex-col gap-4 text-center">
            
            <div className="flex items-center gap-3 justify-center select-none">
              <Loader2 className="h-5 w-5 animate-spin text-primary" />
              <span className="font-extrabold text-sm text-foreground">Uploading images to Cloudinary...</span>
            </div>
            
            <p className="text-[10px] text-muted-foreground leading-normal mt-0.5">
              Simulating file upload chunks and optimized responsive variant generation.
            </p>
            
            <div className="flex flex-col gap-3.5 max-h-[300px] overflow-y-auto pr-1 text-left mt-2">
              {imageFiles.map((file) => {
                const progress = uploadProgress[file.id] || 0;
                return (
                  <div key={file.id} className="flex flex-col gap-1.5">
                    <div className="flex items-center justify-between text-[10px] font-bold">
                      <span className="truncate max-w-[200px] text-foreground">{file.name}</span>
                      <span className="text-primary">{progress}%</span>
                    </div>
                    <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-primary rounded-full transition-all duration-150"
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

// DnD Sortable Item Sub-component
interface SortableItemProps {
  file: ImageFile;
  isCover: boolean;
  onRemove: (id: string) => void;
}

function SortableItem({ file, isCover, onRemove }: SortableItemProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: file.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 50 : undefined,
    opacity: isDragging ? 0.6 : 1,
  };

  const formatBytes = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const dm = 1;
    const sizes = ['Bytes', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`relative group rounded-2xl overflow-hidden border bg-background flex flex-col p-2 transition-all select-none cursor-grab active:cursor-grabbing ${
        isCover ? 'border-primary ring-2 ring-primary/10 shadow-md scale-101' : 'border-border/60 hover:border-border shadow-xs'
      }`}
    >
      <div {...attributes} {...listeners} className="relative aspect-4/3 rounded-xl overflow-hidden bg-muted">
        <Image
          src={file.url}
          alt={file.name}
          fill
          sizes="(max-width: 640px) 50vw, 33vw"
          className="object-cover pointer-events-none"
        />
        {isCover && (
          <div className="absolute top-2 left-2 bg-primary text-primary-foreground font-black text-[9px] uppercase px-2 py-0.5 rounded-lg shadow-3xs select-none">
            Cover
          </div>
        )}
        
        {/* Remove button explicitly stops event propagation to prevent drag activation */}
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onRemove(file.id);
          }}
          className="absolute top-2 right-2 p-1.5 rounded-lg bg-destructive hover:bg-destructive/95 text-destructive-foreground shadow-xs cursor-pointer select-none pointer-events-auto transition-transform active:scale-95 flex items-center justify-center"
        >
          <Trash2 className="h-3.5 w-3.5" />
        </button>
      </div>

      <div className="mt-2 flex flex-col text-left px-1 max-w-full overflow-hidden">
        <span className="text-[10px] font-bold text-foreground truncate">{file.name}</span>
        <span className="text-[9px] font-semibold text-muted-foreground mt-0.5">{formatBytes(file.size)}</span>
      </div>
    </div>
  );
}
