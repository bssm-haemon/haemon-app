declare global {
  namespace JSX {
    interface IntrinsicElements {
      'model-viewer': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement> & {
        src?: string;
        'ios-src'?: string; // Add ios-src property
        alt?: string;
        ar?: boolean;
        'ar-modes'?: string;
        'ar-placement'?: string;
        'ar-scale'?: string;
        'camera-controls'?: boolean;
        'auto-rotate'?: boolean;
        'shadow-intensity'?: string;
        'environment-image'?: string;
        exposure?: string;
        'skybox-image'?: string;
        'quick-look-browsers'?: string;
        // Add any other attributes you use on model-viewer
      };
    }
  }
}