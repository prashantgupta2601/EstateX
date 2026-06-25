import React from 'react';

export default function Footer() {
  return (
    <footer className="w-full border-t bg-muted py-6 px-4">
      <div className="mx-auto max-w-7xl text-center text-sm text-muted-foreground">
        <p>&copy; {new Date().getFullYear()} EstateX. All rights reserved.</p>
      </div>
    </footer>
  );
}
