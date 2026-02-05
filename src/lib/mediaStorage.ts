 /**
  * IndexedDB-based media storage for persistent file storage
  * Files are stored as base64 data URLs that persist across server restarts
  */
 
 const DB_NAME = 'quiz-media-db';
 const DB_VERSION = 1;
 const STORE_NAME = 'media-files';
 
 interface StoredMedia {
   id: string;
   dataUrl: string;
   type: 'image' | 'audio' | 'video';
   mimeType: string;
   createdAt: number;
 }
 
 let dbPromise: Promise<IDBDatabase> | null = null;
 
 function openDB(): Promise<IDBDatabase> {
   if (dbPromise) return dbPromise;
   
   dbPromise = new Promise((resolve, reject) => {
     const request = indexedDB.open(DB_NAME, DB_VERSION);
     
     request.onerror = () => reject(request.error);
     request.onsuccess = () => resolve(request.result);
     
     request.onupgradeneeded = (event) => {
       const db = (event.target as IDBOpenDBRequest).result;
       if (!db.objectStoreNames.contains(STORE_NAME)) {
         db.createObjectStore(STORE_NAME, { keyPath: 'id' });
       }
     };
   });
   
   return dbPromise;
 }
 
 /**
  * Generate a unique ID for media files
  */
 export function generateMediaId(): string {
   return `media_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
 }
 
 /**
  * Convert a File to a base64 data URL
  */
 function fileToDataUrl(file: File): Promise<string> {
   return new Promise((resolve, reject) => {
     const reader = new FileReader();
     reader.onload = () => resolve(reader.result as string);
     reader.onerror = () => reject(reader.error);
     reader.readAsDataURL(file);
   });
 }
 
 /**
  * Store a media file in IndexedDB
  * Returns the unique ID that can be used to retrieve the file
  */
 export async function storeMediaFile(file: File): Promise<{ id: string; type: 'image' | 'audio' | 'video' }> {
   const db = await openDB();
   const id = generateMediaId();
   const dataUrl = await fileToDataUrl(file);
   
   let type: 'image' | 'audio' | 'video' = 'image';
   if (file.type.startsWith('audio/')) type = 'audio';
   else if (file.type.startsWith('video/')) type = 'video';
   
   const storedMedia: StoredMedia = {
     id,
     dataUrl,
     type,
     mimeType: file.type,
     createdAt: Date.now(),
   };
   
   return new Promise((resolve, reject) => {
     const transaction = db.transaction([STORE_NAME], 'readwrite');
     const store = transaction.objectStore(STORE_NAME);
     const request = store.put(storedMedia);
     
     request.onsuccess = () => resolve({ id, type });
     request.onerror = () => reject(request.error);
   });
 }
 
 /**
  * Retrieve a media file from IndexedDB by its ID
  * Returns the data URL and type, or null if not found
  */
 export async function getMediaFile(id: string): Promise<{ dataUrl: string; type: 'image' | 'audio' | 'video' } | null> {
   // If it's already a data URL or blob URL, return it directly
   if (id.startsWith('data:') || id.startsWith('blob:')) {
     // For data URLs, detect type from the MIME type
     let type: 'image' | 'audio' | 'video' = 'image';
     if (id.includes('audio/')) type = 'audio';
     else if (id.includes('video/')) type = 'video';
     return { dataUrl: id, type };
   }
   
   try {
     const db = await openDB();
     
     return new Promise((resolve, reject) => {
       const transaction = db.transaction([STORE_NAME], 'readonly');
       const store = transaction.objectStore(STORE_NAME);
       const request = store.get(id);
       
       request.onsuccess = () => {
         const result = request.result as StoredMedia | undefined;
         if (result) {
           resolve({ dataUrl: result.dataUrl, type: result.type });
         } else {
           resolve(null);
         }
       };
       request.onerror = () => reject(request.error);
     });
   } catch (error) {
     console.error('Error retrieving media file:', error);
     return null;
   }
 }
 
 /**
  * Delete a media file from IndexedDB
  */
 export async function deleteMediaFile(id: string): Promise<void> {
   // Don't try to delete data URLs or blob URLs
   if (id.startsWith('data:') || id.startsWith('blob:')) return;
   
   try {
     const db = await openDB();
     
     return new Promise((resolve, reject) => {
       const transaction = db.transaction([STORE_NAME], 'readwrite');
       const store = transaction.objectStore(STORE_NAME);
       const request = store.delete(id);
       
       request.onsuccess = () => resolve();
       request.onerror = () => reject(request.error);
     });
   } catch (error) {
     console.error('Error deleting media file:', error);
   }
 }
 
 /**
  * Check if a media ID exists in storage
  */
 export async function mediaExists(id: string): Promise<boolean> {
   if (id.startsWith('data:') || id.startsWith('blob:')) return true;
   
   const media = await getMediaFile(id);
   return media !== null;
 }