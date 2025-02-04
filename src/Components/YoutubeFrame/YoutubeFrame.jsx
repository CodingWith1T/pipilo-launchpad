export const YoutubeFrame = ({ videoUrl }) => {
    console.log({ videoUrl });
    let embedUrl;

    if (videoUrl.includes('embed')) {
        embedUrl = videoUrl;
    } else {
        let videoId;
        if (videoUrl.includes('v=')) {
            videoId = videoUrl.split('v=')[1]?.split('&')[0];
        } else if (videoUrl.includes('youtu.be/')) {
            videoId = videoUrl.split('youtu.be/')[1];
        }

        if (videoId) {
            embedUrl = `https://www.youtube.com/embed/${videoId}`;
        } else {
            console.error("Invalid YouTube URL");
            return null;
        }
    }

    return (
        <div className="youtubebox">
            <iframe
                width="100%"
                height="400"
                src={embedUrl}
                title="YouTube video player"
                border="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
            />
        </div>
    );
};
