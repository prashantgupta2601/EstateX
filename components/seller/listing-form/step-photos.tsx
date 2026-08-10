'use client';

import React, { useState, useCallback, useEffect, useRef, useMemo } from 'react';
import { UseFormSetValue, UseFormWatch, FieldErrors, UseFormTrigger } from 'react-hook-form';
import { 
  ChevronRight, 
  ChevronLeft, 
  Image as ImageIcon, 
  Trash2, 
  Camera, 
  Sparkles, 
  Loader2,
  AlertTriangle,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
  ChevronDown,
  ChevronUp,
  Info,
  Wand2,
  ShieldAlert
} from 'lucide-react';
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
import { RadialBarChart, RadialBar, PolarAngleAxis, ResponsiveContainer } from 'recharts';

export interface ImageAnalysis {
  score: number;
  issues: string[];
  suggestions: string[];
  isAcceptable: boolean;
  category: 'excellent' | 'good' | 'average' | 'poor';
}

export interface ImageFile {
  id: string;
  url: string;
  name: string;
  size: number;
  analysis?: ImageAnalysis;
  isAnalyzing?: boolean;
  analysisError?: string;
}

interface StepPhotosProps {
  setValue: UseFormSetValue<ListingFormValues>;
  watch: UseFormWatch<ListingFormValues>;
  errors: FieldErrors<ListingFormValues>;
  trigger: UseFormTrigger<ListingFormValues>;
  onNext: () => void;
  onBack: () => void;
}

const sampleImages = [
  'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80'
];

/**
 * Helper to convert an image URL (Blob, HTTP, Data URI) into Base64 for Gemini Vision API
 */
async function urlToBase64(url: string): Promise<{ imageBase64: string; mimeType: string }> {
  if (url.startsWith('data:')) {
    const parts = url.split(',');
    const mimeType = parts[0].match(/:(.*?);/)?.[1] || 'image/jpeg';
    return { imageBase64: parts[1], mimeType };
  }

  try {
    const res = await fetch(url);
    const blob = await res.blob();
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        const resultStr = reader.result as string;
        const parts = resultStr.split(',');
        const mimeType = parts[0].match(/:(.*?);/)?.[1] || blob.type || 'image/jpeg';
        resolve({ imageBase64: parts[1], mimeType });
      };
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  } catch {
    // Fallback using offscreen canvas for cross-origin or blob URL
    return new Promise((resolve, reject) => {
      const img = new window.Image();
      img.crossOrigin = 'Anonymous';
      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = img.width || 800;
        canvas.height = img.height || 600;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(img, 0, 0);
          const dataUrl = canvas.toDataURL('image/jpeg', 0.85);
          const parts = dataUrl.split(',');
          resolve({ imageBase64: parts[1], mimeType: 'image/jpeg' });
        } else {
          reject(new Error('Canvas context error'));
        }
      };
      img.onerror = () => reject(new Error('Failed to load image for base64 conversion'));
      img.src = url;
    });
  }
}

export default function StepPhotos({
  setValue,
  watch,
  errors,
  trigger,
  onNext,
  onBack
}: StepPhotosProps) {
  const rawImages = watch('photosDetails.images');
  const images = useMemo(() => rawImages || [], [rawImages]);
  
  // Local state to keep track of file metadata and AI analysis results
  const [imageFiles, setImageFiles] = useState<ImageFile[]>(() => {
    return images.map((url, idx) => ({
      id: `img-${idx}-${Date.now()}`,
      url,
      name: url.startsWith('http') ? `property-image-${idx + 1}.jpg` : 'uploaded-image.jpg',
      size: url.startsWith('http') ? 1572864 : 838860,
    }));
  });

  // Track active analysis jobs to prevent duplicates
  const analyzingRef = useRef<Set<string>>(new Set());

  // Simulated upload progress state
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<{ [id: string]: number }>({});

  // Expanded card state for hover/click issues view
  const [expandedImageId, setExpandedImageId] = useState<string | null>(null);

  // Sync imageFiles with form state when photosDetails.images changes externally
  useEffect(() => {
    setImageFiles(prev => {
      const updated: ImageFile[] = images.map((url, idx) => {
        const existing = prev.find(p => p.url === url);
        if (existing) return existing;
        return {
          id: `img-${idx}-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
          url,
          name: url.startsWith('http') ? `property-image-${idx + 1}.jpg` : 'uploaded-image.jpg',
          size: 1048576,
        };
      });
      return updated;
    });
  }, [images]);

  // Function to call AI quality checker API for a single image
  const analyzeSingleImage = useCallback(async (file: ImageFile) => {
    if (file.analysis || file.isAnalyzing || analyzingRef.current.has(file.id)) return;

    analyzingRef.current.add(file.id);
    setImageFiles(prev =>
      prev.map(f => (f.id === file.id ? { ...f, isAnalyzing: true, analysisError: undefined } : f))
    );

    try {
      const { imageBase64, mimeType } = await urlToBase64(file.url);
      const res = await fetch('/api/ai/analyze-image', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ imageBase64, mimeType }),
      });

      if (!res.ok) {
        throw new Error(`API returned status ${res.status}`);
      }

      const data: ImageAnalysis = await res.json();

      setImageFiles(prev =>
        prev.map(f => (f.id === file.id ? { ...f, analysis: data, isAnalyzing: false } : f))
      );
    } catch (err: unknown) {
      const errorMsg = err instanceof Error ? err.message : 'Analysis failed';
      console.error(`Failed to analyze image ${file.id}:`, errorMsg);
      setImageFiles(prev =>
        prev.map(f =>
          f.id === file.id
            ? {
                ...f,
                isAnalyzing: false,
                analysisError: errorMsg,
              }
            : f
        )
      );
    } finally {
      analyzingRef.current.delete(file.id);
    }
  }, []);

  // Trigger analysis automatically for any un-analyzed images
  useEffect(() => {
    imageFiles.forEach(file => {
      if (!file.analysis && !file.isAnalyzing && !analyzingRef.current.has(file.id)) {
        analyzeSingleImage(file);
      }
    });
  }, [imageFiles, analyzeSingleImage]);

  const handleUseSamples = () => {
    const newFiles: ImageFile[] = sampleImages.map((url, idx) => ({
      id: `sample-${idx}-${Date.now()}`,
      url,
      name: `sample-image-${idx + 1}.jpg`,
      size: 1572864,
    }));
    setImageFiles(newFiles);
    setValue('photosDetails.images', newFiles.map(f => f.url), { shouldValidate: true });
    toast('Sample photos loaded! AI quality analysis started.', 'success');
  };

  const handleRemovePhoto = useCallback((id: string) => {
    setImageFiles((prev) => {
      const updated = prev.filter((f) => f.id !== id);
      setValue('photosDetails.images', updated.map(f => f.url), { shouldValidate: true });
      return updated;
    });
    if (expandedImageId === id) setExpandedImageId(null);
  }, [setValue, expandedImageId]);

  // react-dropzone config
  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (imageFiles.length + acceptedFiles.length > 20) {
      toast('You can upload up to 20 images maximum.', 'error');
      return;
    }

    const newFiles: ImageFile[] = acceptedFiles.map((file, idx) => ({
      id: `file-${idx}-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
      url: URL.createObjectURL(file),
      name: file.name,
      size: file.size,
    }));

    setImageFiles((prev) => {
      const updated = [...prev, ...newFiles];
      setValue('photosDetails.images', updated.map(f => f.url), { shouldValidate: true });
      return updated;
    });

    toast(`Added ${acceptedFiles.length} photo(s). AI quality analysis running...`, 'success');
  }, [imageFiles.length, setValue]);

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
        distance: 8,
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
        setValue('photosDetails.coverIndex', 0, { shouldValidate: true });
        return updated;
      });
    }
  };

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

  // Overall Quality Summary Calculation
  const analyzedFiles = imageFiles.filter(f => f.analysis);
  const totalAnalyzed = analyzedFiles.length;
  const rawAvg = totalAnalyzed > 0
    ? analyzedFiles.reduce((acc, f) => acc + (f.analysis?.score || 0), 0) / totalAnalyzed
    : 0;
  const avgScoreFormatted = rawAvg > 0 ? rawAvg.toFixed(1) : '0.0';
  const numericAvg = parseFloat(avgScoreFormatted);

  const poorCount = imageFiles.filter(f => f.analysis && f.analysis.score < 5).length;
  const goodCount = imageFiles.filter(f => f.analysis && f.analysis.score >= 5 && f.analysis.score < 8).length;
  const excellentCount = imageFiles.filter(f => f.analysis && f.analysis.score >= 8).length;

  let overallColorHex = '#10b981'; // Green
  if (numericAvg < 5) {
    overallColorHex = '#ef4444'; // Red
  } else if (numericAvg < 8) {
    overallColorHex = '#f59e0b'; // Yellow
  }

  const chartData = [
    { name: 'Quality', value: numericAvg, fill: overallColorHex }
  ];

  return (
    <div className="flex flex-col gap-5 py-2 animate-in fade-in duration-300 relative select-none">
      
      {/* Step Header */}
      <div className="flex items-center justify-between border-b border-border/25 pb-2.5">
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
        className={`border-2 border-dashed rounded-2xl p-6 flex flex-col items-center justify-center text-center gap-2.5 cursor-pointer transition-all ${
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

      {/* Overall Photo Score Summary Header (Requirement 2 & 4) */}
      {imageFiles.length > 0 && (
        <div className="bg-card border border-border/60 rounded-2xl p-4 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4 w-full sm:w-auto">
            {/* Recharts RadialBar Gauge */}
            <div className="relative w-24 h-24 flex items-center justify-center shrink-0">
              <ResponsiveContainer width="100%" height="100%">
                <RadialBarChart 
                  cx="50%" 
                  cy="50%" 
                  innerRadius="70%" 
                  outerRadius="100%" 
                  barSize={8} 
                  data={chartData} 
                  startAngle={90} 
                  endAngle={-270}
                >
                  <PolarAngleAxis type="number" domain={[0, 10]} angleAxisId={0} tick={false} />
                  <RadialBar 
                    dataKey="value" 
                    cornerRadius={10} 
                    background={{ fill: 'rgba(150, 150, 150, 0.15)' }} 
                  />
                </RadialBarChart>
              </ResponsiveContainer>
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center pointer-events-none">
                <span className="text-base font-extrabold text-foreground leading-none">{avgScoreFormatted}</span>
                <span className="text-[9px] text-muted-foreground font-bold mt-0.5">out of 10</span>
              </div>
            </div>

            <div className="flex flex-col gap-1 text-left">
              <div className="flex items-center gap-2">
                <Wand2 className="h-4 w-4 text-primary" />
                <h3 className="text-sm font-extrabold text-foreground">
                  Your listing photos: {avgScoreFormatted}/10 average quality
                </h3>
              </div>
              <p className="text-xs text-muted-foreground">
                {totalAnalyzed < imageFiles.length ? (
                  <span className="inline-flex items-center gap-1 text-primary font-medium animate-pulse">
                    <Loader2 className="h-3 w-3 animate-spin" />
                    Analyzing {imageFiles.length - totalAnalyzed} photo(s) with Gemini Vision...
                  </span>
                ) : numericAvg >= 8 ? (
                  'High quality photos boost buyer inquiries by up to 40%!'
                ) : numericAvg >= 5 ? (
                  'Good visual quality! Check individual photo suggestions for minor tweaks.'
                ) : (
                  'Low quality photos detected. Replacing poor photos improves lead conversion.'
                )}
              </p>
            </div>
          </div>

          {/* Breakdown Badges */}
          <div className="flex items-center gap-2 shrink-0 self-start sm:self-center">
            {excellentCount > 0 && (
              <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                <CheckCircle2 className="h-3 w-3" />
                {excellentCount} Excellent
              </span>
            )}
            {goodCount > 0 && (
              <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2.5 py-1 rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
                <Info className="h-3 w-3" />
                {goodCount} Good
              </span>
            )}
            {poorCount > 0 && (
              <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2.5 py-1 rounded-full bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20">
                <AlertTriangle className="h-3 w-3" />
                {poorCount} Retake Recommended
              </span>
            )}
          </div>
        </div>
      )}

      {/* Drag-to-reorder Previews Grid */}
      {imageFiles.length > 0 && (
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <div className="flex flex-col gap-2 mt-1">
            <div className="flex items-center justify-between text-left mb-1">
              <div>
                <h4 className="text-xs font-black text-foreground">Property Images ({imageFiles.length})</h4>
                <p className="text-[9px] text-muted-foreground mt-0.5">
                  Drag photos to reorder. The first photo is your main cover photo.
                </p>
              </div>
            </div>
            
            <SortableContext items={imageFiles.map(f => f.id)} strategy={rectSortingStrategy}>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 animate-in zoom-in-95 duration-200">
                {imageFiles.map((file, idx) => (
                  <SortableItem
                    key={file.id}
                    file={file}
                    isCover={idx === 0}
                    isExpanded={expandedImageId === file.id}
                    onToggleExpand={() => setExpandedImageId(expandedImageId === file.id ? null : file.id)}
                    onRetryAnalysis={() => analyzeSingleImage(file)}
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
            
            <div className="flex items-center gap-3 justify-center">
              <Loader2 className="h-5 w-5 animate-spin text-primary" />
              <span className="font-extrabold text-sm text-foreground">Uploading images to server...</span>
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

// DnD Sortable Item Sub-component with AI Quality Badge & Feedback Details
interface SortableItemProps {
  file: ImageFile;
  isCover: boolean;
  isExpanded: boolean;
  onToggleExpand: () => void;
  onRetryAnalysis: () => void;
  onRemove: (id: string) => void;
}

function SortableItem({
  file,
  isCover,
  isExpanded,
  onToggleExpand,
  onRetryAnalysis,
  onRemove,
}: SortableItemProps) {
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

  const analysis = file.analysis;
  const isPoor = analysis && analysis.score < 5;
  const isGood = analysis && analysis.score >= 5 && analysis.score < 8;

  // Score Badge Color Styling (Requirement 2)
  let badgeBg = 'bg-emerald-500 text-white';
  let categoryColor = 'text-emerald-600 dark:text-emerald-400';
  let borderColor = 'border-border/60 hover:border-border';

  if (isPoor) {
    badgeBg = 'bg-rose-600 text-white';
    categoryColor = 'text-rose-600 dark:text-rose-400';
    borderColor = 'border-rose-500/40 ring-1 ring-rose-500/20';
  } else if (isGood) {
    badgeBg = 'bg-amber-500 text-white';
    categoryColor = 'text-amber-600 dark:text-amber-400';
    borderColor = 'border-amber-500/40';
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`relative group rounded-2xl overflow-hidden border bg-card flex flex-col p-2.5 transition-all cursor-grab active:cursor-grabbing ${
        isCover ? 'border-primary ring-2 ring-primary/10 shadow-md' : borderColor
      }`}
    >
      {/* Image Thumbnail Container */}
      <div {...attributes} {...listeners} className="relative aspect-4/3 rounded-xl overflow-hidden bg-muted">
        <Image
          src={file.url}
          alt={file.name}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          className="object-cover pointer-events-none"
        />

        {/* Cover Tag */}
        {isCover && (
          <div className="absolute top-2 left-2 z-10 bg-primary text-primary-foreground font-black text-[9px] uppercase px-2 py-0.5 rounded-lg shadow-xs select-none">
            Cover Photo
          </div>
        )}

        {/* Score Badge (Top Right) - Requirement 2 */}
        {analysis && !file.isAnalyzing && (
          <div className={`absolute top-2 right-10 z-10 font-black text-[10px] px-2 py-0.5 rounded-lg shadow-sm flex items-center gap-1 ${badgeBg}`}>
            <span>{analysis.score}/10</span>
          </div>
        )}

        {/* AI Loading Spinner Overlay (Requirement 3) */}
        {file.isAnalyzing && (
          <div className="absolute inset-0 z-20 bg-background/70 backdrop-blur-xs flex flex-col items-center justify-center text-center p-2">
            <Loader2 className="h-6 w-6 text-primary animate-spin mb-1" />
            <span className="text-[10px] font-bold text-foreground">Analyzing Quality...</span>
            <span className="text-[8px] text-muted-foreground">Gemini Vision AI</span>
          </div>
        )}

        {/* Warning Overlay for Poor Images (Score < 5) - Requirement 2 */}
        {isPoor && !file.isAnalyzing && (
          <div className="absolute inset-x-0 bottom-0 z-10 bg-rose-950/85 text-rose-100 p-1.5 backdrop-blur-xs text-left border-t border-rose-500/40">
            <div className="flex items-start gap-1.5">
              <ShieldAlert className="h-3.5 w-3.5 text-rose-400 shrink-0 mt-0.5" />
              <p className="text-[9px] font-bold leading-tight">
                Low quality image may reduce leads. Consider replacing.
              </p>
            </div>
          </div>
        )}

        {/* Trash / Delete Button */}
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onRemove(file.id);
          }}
          className="absolute top-2 right-2 z-20 p-1.5 rounded-lg bg-destructive/90 hover:bg-destructive text-destructive-foreground shadow-xs cursor-pointer select-none pointer-events-auto transition-transform active:scale-95 flex items-center justify-center"
          title="Remove photo"
        >
          <Trash2 className="h-3.5 w-3.5" />
        </button>
      </div>

      {/* Metadata & AI Quality Category */}
      <div className="mt-2.5 flex flex-col gap-1 text-left px-1">
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-extrabold text-foreground truncate max-w-[140px]">
            {file.name}
          </span>
          {analysis && (
            <span className={`text-[10px] font-black uppercase tracking-wider ${categoryColor}`}>
              {analysis.category}
            </span>
          )}
        </div>

        {/* Retry Button if Analysis Failed */}
        {file.analysisError && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onRetryAnalysis();
            }}
            className="text-[9px] font-bold text-amber-600 dark:text-amber-400 flex items-center gap-1 hover:underline cursor-pointer mt-0.5"
          >
            <RefreshCw className="h-3 w-3" />
            <span>Retry Analysis</span>
          </button>
        )}

        {/* Click/Hover to Expand Details (Requirement 2 & Suggestions) */}
        {analysis && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onToggleExpand();
            }}
            className="mt-1.5 text-[10px] font-bold text-primary hover:text-primary/80 flex items-center justify-between bg-primary/5 hover:bg-primary/10 px-2 py-1 rounded-lg border border-primary/15 transition-colors cursor-pointer"
          >
            <span className="flex items-center gap-1">
              <Sparkles className="h-3 w-3 text-primary" />
              <span>AI Feedback & Suggestions</span>
            </span>
            {isExpanded ? <ChevronUp className="h-3.5 w-3.5" /> : <ChevronDown className="h-3.5 w-3.5" />}
          </button>
        )}

        {/* Expanded Analysis Feedback Drawer */}
        {isExpanded && analysis && (
          <div className="mt-2 p-2.5 rounded-xl bg-muted/40 border border-border/50 text-[10px] flex flex-col gap-2 animate-in fade-in zoom-in-95 duration-150">
            {/* Issues List */}
            {analysis.issues.length > 0 && (
              <div className="flex flex-col gap-1">
                <span className="font-extrabold text-destructive flex items-center gap-1 text-[9.5px]">
                  <AlertCircle className="h-3 w-3" />
                  Issues Detected:
                </span>
                <ul className="list-disc list-inside space-y-0.5 text-muted-foreground pl-1">
                  {analysis.issues.map((issue, i) => (
                    <li key={i} className="leading-tight">{issue}</li>
                  ))}
                </ul>
              </div>
            )}

            {/* Retake & Suggestions Highlight (Requirement 2 & 5) */}
            {analysis.suggestions.length > 0 && (
              <div className="flex flex-col gap-1">
                <span className="font-extrabold text-emerald-600 dark:text-emerald-400 flex items-center gap-1 text-[9.5px]">
                  <Sparkles className="h-3 w-3" />
                  {isPoor ? 'Retake Suggestions:' : 'Suggestions for Improvement:'}
                </span>
                <ul className="list-disc list-inside space-y-0.5 text-foreground/90 pl-1 font-medium">
                  {analysis.suggestions.map((sug, i) => (
                    <li key={i} className="leading-tight">{sug}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
