'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import styles from './NftGallery.module.css';
import NftModal from './NftModal';

const PAGE_SIZE_OPTIONS = [20, 50, 100];
const MAX_NFT_ID = 1000; // Total number of NFTs in the collection (corrected from 4000)

export default function NftGallery() {
  const [pageSize, setPageSize] = useState(100); // Default to 100 per page
  const [currentPage, setCurrentPage] = useState(1);
  const [displayedNfts, setDisplayedNfts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedNft, setSelectedNft] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // Calculate total pages
  const totalPages = Math.ceil(MAX_NFT_ID / pageSize);

  // Generate NFT IDs for current page
  useEffect(() => {
    setIsLoading(true);
    
    const start = (currentPage - 1) * pageSize + 1;
    const end = Math.min(start + pageSize - 1, MAX_NFT_ID);
    
    const nfts = [];
    for (let i = start; i <= end; i++) {
      nfts.push(i);
    }
    
    setDisplayedNfts(nfts);
    setIsLoading(false);
  }, [currentPage, pageSize]);

  // Format token ID for URL (pad with leading zeros to 4 digits)
  const formatTokenId = (id) => {
    return String(id).padStart(4, '0');
  };

  // Handle page change
  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  // Handle page size change
  const handlePageSizeChange = (event) => {
    const newPageSize = Number(event.target.value);
    setPageSize(newPageSize);
    setCurrentPage(1); // Reset to first page when changing page size
  };
  
  // Handle opening the modal when clicking on an NFT
  const handleNftClick = (id) => {
    setSelectedNft(id);
    setIsModalOpen(true);
  };
  
  // Handle closing the modal
  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  return (
    <div className={styles.galleryContainer}>
      <h2 className={styles.galleryTitle}>Browse MiLego Gallery</h2>
      
      <div className={styles.controlsContainer}>
        <div className={styles.pageSizeControl}>
          <label htmlFor="pageSize">MiLegos per page:</label>
          <select 
            id="pageSize" 
            value={pageSize} 
            onChange={handlePageSizeChange}
            className={styles.pageSizeSelect}
          >
            {PAGE_SIZE_OPTIONS.map(size => (
              <option key={size} value={size}>{size}</option>
            ))}
          </select>
        </div>
        
        <div className={styles.pagination}>
          <button 
            onClick={() => handlePageChange(1)} 
            disabled={currentPage === 1}
            className={styles.pageButton}
          >
            First
          </button>
          <button 
            onClick={() => handlePageChange(currentPage - 1)} 
            disabled={currentPage === 1}
            className={styles.pageButton}
          >
            Prev
          </button>
          <span className={styles.pageInfo}>
            Page {currentPage} of {totalPages}
          </span>
          <button 
            onClick={() => handlePageChange(currentPage + 1)} 
            disabled={currentPage === totalPages}
            className={styles.pageButton}
          >
            Next
          </button>
          <button 
            onClick={() => handlePageChange(totalPages)} 
            disabled={currentPage === totalPages}
            className={styles.pageButton}
          >
            Last
          </button>
        </div>
      </div>
      
      {isLoading ? (
        <div className={styles.loadingContainer}>
          <div className={styles.loadingBox}>
            <p>Loading NFTs...</p>
            <div className={styles.loadingAnimation}>
              <span></span>
            </div>
          </div>
        </div>
      ) : (
        <div className={styles.nftGrid}>
          {displayedNfts.map(id => {
            const formattedId = formatTokenId(id);
            return (
              <div key={id} className={styles.nftItem}>
                {/* NFT card is clickable to open the modal */}
                <div 
                  className={styles.nftCard}
                  onClick={() => handleNftClick(id)}
                >
                  <div className={styles.imageContainer}>
                    <Image 
                      src={`/milego/${formattedId}/${formattedId}_Render.png`}
                      alt={`MiLego #${id}`}
                      width={150}
                      height={150}
                      className={styles.nftImage}
                      priority={id % pageSize < 9} // Prioritize loading first row of images
                      onError={(e) => {
                        // Try JPG render if PNG doesn't exist
                        e.currentTarget.src = `/milego/${formattedId}/${formattedId}_Render.jpg`;
                        // Set up a fallback in case JPG also fails
                        e.currentTarget.onerror = () => {
                          e.currentTarget.src = `/milego/${formattedId}/${formattedId}.png`;
                          e.currentTarget.onerror = null; // Prevent infinite loop
                        };
                      }}
                    />
                  </div>
                  <div className={styles.nftInfo}>
                    <span className={styles.nftId}>#{id}</span>
                  </div>
                </div>
                
                {/* Independent View 3D button */}
                <Link 
                  href={`/${formattedId}`} 
                  className={styles.viewButton}
                  onClick={(e) => e.stopPropagation()}
                >
                  View 3D Model
                </Link>
              </div>
            );
          })}
        </div>
      )}
      
      {/* Bottom pagination */}
      <div className={styles.paginationBottom}>
        <button 
          onClick={() => handlePageChange(1)} 
          disabled={currentPage === 1}
          className={styles.pageButton}
        >
          First
        </button>
        <button 
          onClick={() => handlePageChange(currentPage - 1)} 
          disabled={currentPage === 1}
          className={styles.pageButton}
        >
          Prev
        </button>
        <span className={styles.pageInfo}>
          Page {currentPage} of {totalPages}
        </span>
        <button 
          onClick={() => handlePageChange(currentPage + 1)} 
          disabled={currentPage === totalPages}
          className={styles.pageButton}
        >
          Next
        </button>
        <button 
          onClick={() => handlePageChange(totalPages)} 
          disabled={currentPage === totalPages}
          className={styles.pageButton}
        >
          Last
        </button>
      </div>
      
      {/* Modal for displaying NFT details */}
      {isModalOpen && selectedNft && (
        <NftModal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          tokenId={selectedNft}
          formattedId={formatTokenId(selectedNft)}
        />
      )}
    </div>
  );
} 