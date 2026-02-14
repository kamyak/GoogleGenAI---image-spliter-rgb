
import React from 'react';

interface ChannelCardProps {
  title: string;
  imageUrl: string;
  colorClass: string;
}

const ChannelCard: React.FC<ChannelCardProps> = ({ title, imageUrl, colorClass }) => {
  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = imageUrl;
    link.download = `chromasplit-${title.toLowerCase()}.png`;
    link.click();
  };

  return (
    <div className="bg-[#1a1a1a] rounded-xl overflow-hidden border border-white/5 hover:border-white/20 transition-all group">
      <div className={`px-4 py-2 text-sm font-semibold border-b border-white/5 flex justify-between items-center ${colorClass}`}>
        <span>{title} Channel</span>
        <button 
          onClick={handleDownload}
          className="opacity-0 group-hover:opacity-100 transition-opacity hover:text-white"
          title="Download this channel"
        >
          <i className="fa-solid fa-download"></i>
        </button>
      </div>
      <div className="p-2 bg-black flex items-center justify-center min-h-[200px]">
        <img src={imageUrl} alt={title} className="max-h-64 object-contain shadow-2xl" />
      </div>
    </div>
  );
};

export default ChannelCard;
