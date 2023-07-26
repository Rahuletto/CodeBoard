import dynamic from 'next/dynamic';
import styles from '../styles/Index.module.css';
import React from 'react';

// Icons

import { IconType } from 'react-icons-ng/lib/esm/index';
const FaHeartBroken = dynamic<React.ComponentProps<IconType>>(() => import('react-icons-ng/fa/index.js').then(mod => mod.FaHeartBroken), { ssr: false })


export default class ErrorBoundary extends React.Component {
    declare state: Readonly<{ hasError: boolean }>;
    constructor(props: any) {
      super(props);
  
      this.state = { hasError: false };
    }
    static getDerivedStateFromError(error: any) {
      return { hasError: true };
    }
    componentDidCatch(error: any, errorInfo: any) {
      console.warn({ error, errorInfo });
    }
    render() {
      if (this.state.hasError) {
        <div
          style={{ zIndex: '2000' }}
          className={[styles.dropzone, styles.backdrop, 'droppy'].join(' ')}>
          <div
            className={['details', 'error', 'droppy'].join(' ')}
            style={{ maxWidth: '400px', justifyContent: 'center' }}>
            <FaHeartBroken style={{ color: 'var(--red)', fontSize: '64px' }} />
            <h1 style={{ margin: '6px', textAlign: 'center' }}>
              ClientSideError
            </h1>
            <p className="error-text" style={{ fontSize: '18px' }}>
              This error didnt occur from cloud, server nor our database. Rather
              its from the Client {'(your browser)'} side. Please contact the
              owner.
            </p>
          </div>
        </div>;
      }
  
      //@ts-ignore
      return this.props.children;
    }
  }
  