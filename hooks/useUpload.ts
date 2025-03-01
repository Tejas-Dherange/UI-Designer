'use client';
import { useUser } from '@clerk/nextjs';
import { useRouter } from 'next/router';
import { useState, useCallback } from 'react';
import { v4 as uuidv4 } from 'uuid';


export enum StatusText {
    UPLOADING = 'uploading file',
    UPLOADED = 'file uploaded',
    SAVING = 'saving file',
    GENERATING = 'generating file,This only takes a few seconds',
}

export type Status=StatusText[keyof  StatusText];


const useUpload = () => {
  const [progress, setProgress] = useState<number | null>(null);
  const [fileId, setFileId] = useState<string | null>(null);
  const [status, setStatus] = useState<string | null>(null);
  const user=useUser();
  // const router= useRouter();

  const handleUpload = async (file: File) => {
   if(!file || !user ) return;

   const fileToUploadTo=uuidv4();
  };

  return {progress,handleUpload,status,fileId};




  
};

export default useUpload;