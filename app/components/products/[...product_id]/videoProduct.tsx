'use client'

export default function VideoProduct(videoProduct: VideoProduct){

    return (          
        <div className="flex lg:w-1/2 lg:h-screen">
            {videoProduct.isVisible ? (
            
                <video controls preload="none" poster={videoProduct.image_url} className="lg:w-3/4 w-[400px] mx-auto lg:my-44 lg:h-80 lg:rounded-md" >
                    <source src={videoProduct.video_url} type="video/mp4" />
                        <track
                        src="/path/to/captions.vtt"
                        kind="subtitles"
                        srcLang="en"
                        label="English"
                        />
                    Your browser does not support the video tag.
                </video>
            
            ) : (
            <div className="w-3/4 mx-auto h-screen"></div>
            )}
           
        </div>      
    )
}