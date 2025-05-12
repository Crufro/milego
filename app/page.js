// Page.js

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import styles from './Home.module.css'; // Import the CSS module

export default function Home() {
  return (
    <div className={styles.mainContainer}>
      <Image src="/images/banner.png" alt="MilegoMaker Logo" className={styles.logo} width={500} height={100} />
      <h1 className={styles.header}>MilegoMaker.net</h1>
      <Image src="/images/MilegoMaker.gif" alt="Your GIF" className={styles.gif} width={400} height={300} />
      <p className={styles.centeredText}>This is neochibi + LEGO</p>
      <a href="https://www.scatter.art/milego-maker" target="_blank" rel="noopener noreferrer">
        <Image src="/images/mint.png" alt="Mint Now" className={styles.mintNowImage} width={200} height={60} />
      </a>
      <div className={styles.linksContainer}>
        <Link href="/gallery" className={styles.link}>Gallery</Link>
        <a href="https://twitter.com/MilegoMaker" target="_blank" rel="noopener noreferrer" className={styles.link}>Twitter</a>
        <a href="https://etherscan.io/address/0x2781d8fb4cf986547cc418a583908bfe92dbd8e5" target="_blank" rel="noopener noreferrer" className={styles.link}>Contract</a>
      </div>
      <Image src="/images/logo.png" alt="Fixed Logo" className={styles.fixedLogo} width={150} height={150} />
      <h2 className={styles.title}>3D Files Included!</h2>
      <p className={styles.text}>Every MiLego comes with original 3D assets and files packaged for use in Blender 3D software.</p>
      <div className={styles.imagesContainer}>
        <Image src="/images/LegoAnnounce.png" alt="Image 1" className={styles.image} width={300} height={200} />
        <Image src="/images/MilegoBlender.png" alt="Image 2" className={styles.image} width={300} height={200} />
      </div>

      {/* New Elements Below */}
      <h2 className={styles.subtitle}>Now Minting</h2>
      <Image src="/images/DCIM_MilegoAlbum_12-17-1993.png" alt="Minting" className={styles.mintingImage} width={400} height={300} />
      <p className={styles.mintingText}>
        Purchase your MiLego NFT by Minting it on Scatter.art
        <br />
        <br />
        • If you hold special NFTs you might be eligible for a FREE MILEGO! (Terms and conditions may apply)
        <br />
        • Your MiLego will be delivered to your ETHEREUM wallet!
        <br />
        • To view your Milego, please log into Scatter.art or view the Gallery!
      </p>

      {/* Footer */}
      <footer className={styles.footer}>
        <a href="https://viralpubliclicense.org/" target="_blank" rel="noopener noreferrer" className={styles.footerLink}>
          VPL MiLego Maker
        </a>
        <Image src="/images/privacyseal6.gif" alt="Small Image 1" className={styles.smallImage} width={60} height={30} />
        <Image src="/images/truste_button.gif" alt="Small Image 2" className={styles.smallImage} width={60} height={30} />
      </footer>
    </div>
  );
}
