import { uxToHex } from '@urbit/api';
import cn from 'classnames';
import React from 'react';

interface ListingImageProps {
  image: string;
  color: string;
  className?: string;
  imageClasses?: string;
  colorClasses?: string;
}

export const ListingImage = ({ image, color, className, imageClasses, colorClasses }: ListingImageProps) => {
  return image ? (
    <img 
      src={image} 
      className={cn('object-cover', className, imageClasses)} 
      style={{ backgroundColor: color ? `#${uxToHex(color)}` : undefined }}
    />
  ) : (
    <div 
      className={cn('bg-rosy/20', className, colorClasses)}
      style={{ backgroundColor: color ? `#${uxToHex(color)}` : undefined }}
    />
  )
}