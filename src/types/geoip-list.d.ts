declare module "geoip-lite" {
     interface Geo {
          range: [number, number][];
          country: string;
          region: string;
          city: string;
          ll: [number, number];
          metro?: number;
          zip?: string;
     }

     function lookup(ip: string): Geo | null;

     export { lookup };
}
