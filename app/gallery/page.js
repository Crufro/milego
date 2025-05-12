'use client';

import React from 'react';
import Link from 'next/link';
import styles from './Gallery.module.css'; // Optional: Add styling
import ConnectWallet from '../components/ConnectWallet';
import NftGallery from '../components/NftGallery';

export default function Gallery() {
  return (
    <div className={styles.galleryContainer}>
      <Link href="/" className={styles.homeLink}>
        ← Home
      </Link>
      
      <h1 className={styles.title}>MiLego Gallery</h1>
      <p className={styles.text}>Connect your wallet to view your MiLego NFTs.</p>
      
      <ConnectWallet />
      
      <p className={styles.text}>
        The gallery displays your MiLego NFTs from contract<br />
        <code className={styles.contractCode}>0x2781d8fb4cf986547cc418a583908bfe92dbd8e5</code>
      </p>
      
      {/* Full NFT Collection Gallery */}
      <NftGallery />
    </div>
  );
} 