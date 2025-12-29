// Kakao Maps API 타입 정의
declare global {
    interface Window {
        kakao: {
            maps: {
                load: (callback: () => void) => void;
                Map: new (container: HTMLElement, options: any) => any;
                LatLng: new (lat: number, lng: number) => any;
                Marker: new (options: any) => any;
                MarkerImage: new (src: string, size: any, options?: any) => any;
                Size: new (width: number, height: number) => any;
                Point: new (x: number, y: number) => any;
                InfoWindow: new (options: any) => any;
                event: {
                    addListener: (target: any, type: string, handler: () => void) => void;
                };
            };
        };
    }
}

export { };
