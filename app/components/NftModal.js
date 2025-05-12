'use client';

import { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import styles from './NftModal.module.css';

// Define image types that can be displayed
const IMAGE_TYPES = [
  { key: 'render', suffix: '_Render.png', fallback: '_Render.jpg', label: 'Render' },
  { key: 'avatar', suffix: '_Render_Avatar.png', fallback: null, label: 'Avatar' },
  { key: 'thumbnail', suffix: '.png', fallback: null, label: 'Texture Image' },
  { key: 'texture', suffix: '_texture.png', fallback: null, label: 'Texture' }
];

export default function NftModal({ isOpen, onClose, tokenId, formattedId }) {
  const [metadata, setMetadata] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [availableImages, setAvailableImages] = useState([]);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [imageLoading, setImageLoading] = useState(false);

  // Format token ID to match file path format (4 digits with leading zeros)
  const getFormattedId = useCallback((id) => {
    if (formattedId) return formattedId;
    return String(id).padStart(4, '0');
  }, [formattedId]);
  
  // Check if an image exists
  const checkImageExists = useCallback(async (url) => {
    try {
      const response = await fetch(url, { method: 'HEAD' });
      return response.ok;
    } catch (error) {
      return false;
    }
  }, []);
  
  // Find available images for this NFT
  const findAvailableImages = useCallback(async (formatted) => {
    const available = [];
    
    for (const imageType of IMAGE_TYPES) {
      const primaryUrl = `/milego/${formatted}/${formatted}${imageType.suffix}`;
      let exists = await checkImageExists(primaryUrl);
      
      if (exists) {
        available.push({
          ...imageType,
          url: primaryUrl
        });
      } else if (imageType.fallback) {
        const fallbackUrl = `/milego/${formatted}/${formatted}${imageType.fallback}`;
        exists = await checkImageExists(fallbackUrl);
        
        if (exists) {
          available.push({
            ...imageType,
            url: fallbackUrl
          });
        }
      }
    }
    
    return available;
  }, [checkImageExists]);

  // Fetch metadata and available images for the token
  useEffect(() => {
    if (!isOpen || !tokenId) return;
    
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      
      try {
        const formatted = getFormattedId(tokenId);
        
        // Fetch metadata
        const response = await fetch(`/milego/${formatted}/${formatted}_metadata.json`);
        
        if (!response.ok) {
          throw new Error(`Failed to load metadata: ${response.status}`);
        }
        
        const data = await response.json();
        setMetadata(data);
        
        // Find available images
        const images = await findAvailableImages(formatted);
        setAvailableImages(images);
        setCurrentImageIndex(0); // Reset to first image
        
      } catch (err) {
        console.error("Error loading data:", err);
        setError("Failed to load NFT data");
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, [isOpen, tokenId, getFormattedId, findAvailableImages]);

  // Navigation functions
  const goToNextImage = () => {
    if (availableImages.length > 1) {
      setImageLoading(true);
      setCurrentImageIndex((prev) => (prev + 1) % availableImages.length);
    }
  };
  
  const goToPrevImage = () => {
    if (availableImages.length > 1) {
      setImageLoading(true);
      setCurrentImageIndex((prev) => (prev - 1 + availableImages.length) % availableImages.length);
    }
  };

  // Close modal when clicking outside or on close button
  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  // Stop propagation to prevent bubbling to backdrop
  const handleContentClick = (e) => {
    e.stopPropagation();
  };
  
  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!isOpen) return;
      
      if (e.key === 'ArrowRight') {
        goToNextImage();
      } else if (e.key === 'ArrowLeft') {
        goToPrevImage();
      } else if (e.key === 'Escape') {
        onClose();
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, availableImages.length, onClose]);

  if (!isOpen) return null;

  const formatted = getFormattedId(tokenId);
  const currentImage = availableImages[currentImageIndex] || null;

  return (
    <div className={styles.modalBackdrop} onClick={handleBackdropClick}>
      <div className={styles.modalContent} onClick={handleContentClick}>
        <button className={styles.closeButton} onClick={onClose}>×</button>
        
        {loading ? (
          <div className={styles.loadingContainer}>
            <div className={styles.loadingBox}>
              <p>Loading metadata...</p>
              <div className={styles.loadingAnimation}>
                <span></span>
              </div>
            </div>
          </div>
        ) : error ? (
          <div className={styles.errorMessage}>{error}</div>
        ) : (
          <div className={styles.modalInner}>
            <div className={styles.imageContainer}>
              {availableImages.length > 1 && (
                <button 
                  className={`${styles.navArrow} ${styles.prevArrow}`}
                  onClick={goToPrevImage}
                  title="Previous image"
                >
                  ‹
                </button>
              )}
              
              {currentImage ? (
                <>
                  <div className={styles.imageWrapper}>
                    <Image 
                      src={currentImage.url}
                      alt={`MiLego #${tokenId} - ${currentImage.label}`}
                      width={350}
                      height={350}
                      className={`${styles.enlargedImage} ${imageLoading ? styles.imageLoading : ''}`}
                      onLoad={() => setImageLoading(false)}
                      priority
                    />
                    {imageLoading && (
                      <div className={styles.imageLoadingOverlay}>
                        <div className={styles.loadingAnimation}>
                          <span></span>
                        </div>
                      </div>
                    )}
                  </div>
                  
                  {availableImages.length > 1 && (
                    <div className={styles.imageDots}>
                      {availableImages.map((_, index) => (
                        <button 
                          key={index} 
                          className={`${styles.dot} ${currentImageIndex === index ? styles.activeDot : ''}`}
                          onClick={() => {
                            setImageLoading(true);
                            setCurrentImageIndex(index);
                          }}
                        />
                      ))}
                    </div>
                  )}
                  
                  <div className={styles.imageInfo}>
                    <span className={styles.imageType}>{currentImage.label}</span>
                    {availableImages.length > 1 && (
                      <span className={styles.imageCounter}>
                        {currentImageIndex + 1} / {availableImages.length}
                      </span>
                    )}
                  </div>
                </>
              ) : (
                <div className={styles.noImage}>No images available</div>
              )}
              
              {availableImages.length > 1 && (
                <button 
                  className={`${styles.navArrow} ${styles.nextArrow}`}
                  onClick={goToNextImage}
                  title="Next image"
                >
                  ›
                </button>
              )}
            </div>
            
            <div className={styles.metadataContainer}>
              <h2 className={styles.nftTitle}>MiLego #{tokenId}</h2>
              
              <Link href={`/${formatted}`} className={styles.view3dButton}>
                View 3D Model
              </Link>
              
              {metadata && metadata.attributes && (
                <div className={styles.attributesContainer}>
                  <h3 className={styles.attributesTitle}>Traits</h3>
                  <div className={styles.attributesList}>
                    {metadata.attributes.map((attribute, index) => (
                      <div key={index} className={styles.attributeItem}>
                        <span className={styles.attributeType}>{attribute.trait_type}</span>
                        <span className={styles.attributeValue}>{attribute.value}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 