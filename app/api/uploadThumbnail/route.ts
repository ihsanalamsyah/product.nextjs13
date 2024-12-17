import { NextResponse, NextRequest } from "next/server";
import { supabase } from '@/utils/supabase';
import path from 'path';
import fs from 'fs';
import ffmpeg from 'fluent-ffmpeg';
import axios from 'axios';

const ffmpegPath = path.join(process.cwd(), 'public/ffmpeg/ffmpeg.exe');
ffmpeg.setFfmpegPath(ffmpegPath);

const uploadsFolder = path.join(process.cwd(), 'public/uploads');

async function UploadToSupabase(filePath:string, productId:number):Promise<boolean> {
    const fileBuffer = fs.readFileSync(filePath);
    let result = false;
    try {
      const { data, error } = await supabase.storage
        .from('videos')
        .upload(`thumbnails/Thumbnail-video-product_id-${productId}.jpg`, fileBuffer, {
          cacheControl: '3600',
          upsert: true,
          contentType: 'image/jpeg',
        });
  
      if (error != null) {
        if(error.message == "The resource already exists"){
          const { data, error } = await supabase.storage
            .from('videos')
            .update(`thumbnails/Thumbnail-video-product_id-${productId}.jpg`, fileBuffer, {
              cacheControl: '3600',
              upsert: true,
              contentType: 'image/jpeg',
            });
          if(error != null){
            return result;
          }
        }
        return result;
      }
      result = true;
      return result;
    } catch (error) {
      console.error('Error UploadToSupabase:', error);
      throw error;
    }
  }

  
async function GenerateThumbnail(inputPath:string, productId:number):Promise<string> {
  const outputThumbnailPath = path.join(uploadsFolder, `Thumbnail-video-product_id-${productId}.jpg`);
  try{
    return new Promise((resolve, reject) => {
      ffmpeg(inputPath)
        .on('end', () => {
          console.log('Thumbnail berhasil dibuat');
          resolve(outputThumbnailPath);
        })
        .on('error', (err) => {
          console.error('Error GenerateThumbnail:', err.message);
          reject(err);
        })
        .screenshots({
          timestamps: ['00:00:02'], 
          filename: `Thumbnail-video-product_id-${productId}.jpg`,
          folder: uploadsFolder,
        });
    });
  }catch(e){
    console.error('Error GenerateThumbnail:', e);
    throw e;
  }
    
  }

async function CreateStreamVideo(destinationPath:string, productId:number):Promise<boolean>{
  let result = false;
  try{
    const { data } = supabase.storage
    .from('videos')
    .getPublicUrl(`Video-product-product_id-${productId}.mp4`)

    //menyimpan video ke destionation
    const writer = fs.createWriteStream(destinationPath);

    const response = await axios({
      method: 'GET',
      url: data.publicUrl,
      responseType: 'stream',
    });

    response.data.pipe(writer);

    await new Promise<boolean>((resolve, reject) => {
      writer.on('finish', ()=>{
        result = true;
        resolve(result);
      });
      writer.on('error',()=>{
        reject(result);
      });
    });
    return result;
  }catch(e){
    console.error('Error CreateStreamVideo:', e);
    throw e;
  }
}

export async function POST(req: NextRequest, res: NextResponse) {
    try {
        const body:UploadThumbnail = await req.json();
        const localVideoPath = path.join(uploadsFolder, `Video-product-product_id-${body.product_id}.mp4`);
        const isCreated = await CreateStreamVideo(localVideoPath, body.product_id);
        if(!isCreated){
          return NextResponse.json({status: "Failed", msg: "Error create stream video", errorMessage: "Error create stream video"} as DynamicResult, {status: 400});
        }
        const thumbnailPath = await GenerateThumbnail(localVideoPath, body.product_id);
        const isUploaded = await UploadToSupabase(thumbnailPath, body.product_id);
        if (!isUploaded) {
          return NextResponse.json({status: "Failed", msg: "Error upload thumbnail", errorMessage: "Error upload thumbnail"} as DynamicResult, {status: 400});   
        } 
        return NextResponse.json({status: "OK", msg: "Success upload thumbnail"} as DynamicResult, {status: 200});
    }
    catch (error){
        return NextResponse.json({status: "Failed", msg: error, errorMessage: error} as DynamicResult, {status: 400});
    }
}