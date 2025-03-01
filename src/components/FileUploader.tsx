'use client'
import {  ArrowDownCircleIcon, RocketIcon } from 'lucide-react';
import React, { useCallback } from 'react'
import { useDropzone } from 'react-dropzone'
import useUpload from '../../hooks/useUpload';

export default   function  MyDropzone() {
    const {progress,handleUpload,status}=useUpload();
    const onDrop = useCallback(async (acceptedFiles: File[]) => {
        // Do something with the files

        const file=acceptedFiles[0];

        if(file){
            await handleUpload(file);
        }else{

        }

    }, [])
    const { getRootProps, getInputProps, isDragActive, isFocused, isDragAccept } = useDropzone({ 
        onDrop ,
        maxFiles:1,
        accept:{
            'application/pdf':['.pdf'],
        },
    })

    return (
        <>
            <div className='mt-10  cursor-pointer w-[90vw] lg:w-[60vw] mx-auto'>

                <div {...getRootProps()} className={`rounded-sm text-blue-800 p-20 sm:p-24 
                border-[2px] border-purple-600 border-dashed flex justify-center
                 items-center
                 ${(isFocused || isDragAccept) ? "bg-indigo-300" : "bg-indigo-100"}
                 `}>
                    <input {...getInputProps()} />
                    <div className='flex flex-col justify-center items-center'>
                        {
                            isDragActive ? (
                                <>
                                    <RocketIcon className='h-20 w-20 animate-ping' />
                                    <p>{`Drop the files here ...`}</p>
                                </>
                            ) : (
                                <>
                                     <ArrowDownCircleIcon className=' h-16 w-16 animate-bounce' />
                                    <p>{`Drag 'n' drop some files here, or click to select files`}</p>
                                </>
                            )
                        }
                    </div>
                </div>
            </div>
        </>
    )
}