import React, { useState } from 'react';
import ModelViewer from '../components/ModelViewer';
import styles from '../app/Home.module.css';


const ModelPage = ({ modelId }) => {
  const [isGrabbing, setIsGrabbing] = useState(false);
  const modelPath = `milego/${modelId}/${modelId}.gltf`; 

  const handleMouseDown = () => {
    setIsGrabbing(true);
  };

  const handleMouseUp = () => {
    setIsGrabbing(false);
  };

  return (
    <div 
      className={`${styles.container} ${isGrabbing ? styles.grabbing : ''}`}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp} 
    >
      <ModelViewer modelPath={modelPath} />
    </div>
  );
};

// This function gets called at build time
export async function getStaticPaths() {
  // Generate paths with `modelId` param for IDs from 0001 to 4000
  const paths = [];
  for (let i = 1; i <= 4000; i++) {
    const modelId = String(i).padStart(4, '0');
    paths.push({ params: { modelId } });
  }

  return { paths, fallback: false };
}

// This gets called on every request
export async function getStaticProps({ params }) {
  return { props: { modelId: params.modelId } };
}

export default ModelPage;
