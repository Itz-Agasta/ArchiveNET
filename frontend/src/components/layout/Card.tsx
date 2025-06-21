export const Card = ({ title, description, imageUrl, className }: { title: string, description: string, imageUrl?: string, className?: string }) => {
    return (
        <div className={`bg-black shadow-md rounded-lg p-1 max-w-[10vw] min-h-[20vh] ${className}`}>
            {imageUrl && (
                <img
                    src={imageUrl}
                    alt={title}
                    className="w-full h-48 object-cover rounded-t-lg mb-4"
                />
            )}
            <h2 className="text-xs font-semibold mb-2 text-white">{title}</h2>
            <p className="text-white text-xs">{description}</p>
        </div>
    );
}