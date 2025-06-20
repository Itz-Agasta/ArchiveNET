export const Card = ({ title, description, imageUrl, className }: { title: string, description: string, imageUrl?: string, className?: string }) => {
    return (
        <div className={`bg-black shadow-md rounded-lg p-6 ${className}`}>
            {imageUrl && (
                <img
                    src={imageUrl}
                    alt={title}
                    className="w-full h-48 object-cover rounded-t-lg mb-4"
                />
            )}
            <h2 className="text-xl font-semibold mb-2">{title}</h2>
            <p className="text-gray-700">{description}</p>
        </div>
    );
}