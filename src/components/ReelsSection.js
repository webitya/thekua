'use client';

import { useEffect, useRef, useState } from 'react';
import { Volume2, VolumeX, Heart, MessageCircle, Send, Bookmark } from 'lucide-react';

const REELS = [
    {
        id: 1,
        url: '/reels/1.mp4',
        user: 'thekua.snacks',
        likes: '1.8k',
        caption: 'Fresh thekua straight from our kitchen 🍪 #Thekua #IndianSnacks #Authentic',
        emoji: '🍪'
    },
    {
        id: 2,
        url: '/reels/2.mp4',
        user: 'thekua.snacks',
        likes: '2.1k',
        caption: 'Crispy nimkin – the perfect tea-time companion ☕ #Nimkin #ChaiSnacks',
        emoji: '☕'
    },
    {
        id: 3,
        url: '/reels/3.mp4',
        user: 'thekua.snacks',
        likes: '3.4k',
        caption: 'Our gujia filling is handmade with pure khoya & dry fruits 🤲 #Gujia #Holi',
        emoji: '🤲'
    },
    {
        id: 4,
        url: '/reels/4.mp4',
        user: 'thekua.snacks',
        likes: '1.5k',
        caption: 'Packing love in every box – festive gifting now open! 🎁 #FestiveGifting',
        emoji: '🎁'
    },
    {
        id: 5,
        url: '/reels/5.mp4',
        user: 'thekua.snacks',
        likes: '4.2k',
        caption: 'The crunch you hear miles away 😍 #MathriCrunch #TraditionalSnacks',
        emoji: '😍'
    },
];

function ReelCard({ reel, isActive, isMuted, toggleMute }) {
    const videoRef = useRef(null);
    const [progress, setProgress] = useState(0);
    const [isPaused, setIsPaused] = useState(true);

    useEffect(() => {
        const video = videoRef.current;
        if (!video) return;

        const attemptPlay = async () => {
            try {
                if (isActive) {
                    await video.play();
                    setIsPaused(false);
                } else {
                    video.pause();
                    video.currentTime = 0;
                    setIsPaused(true);
                    setProgress(0);
                }
            } catch (err) {
                setIsPaused(true);
            }
        };

        attemptPlay();

        const handleTimeUpdate = () => {
            if (video.duration) {
                setProgress((video.currentTime / video.duration) * 100);
            }
        };

        video.addEventListener('timeupdate', handleTimeUpdate);
        return () => video.removeEventListener('timeupdate', handleTimeUpdate);
    }, [isActive]);

    const togglePlay = () => {
        const video = videoRef.current;
        if (!video) return;
        if (video.paused) {
            video.play().then(() => setIsPaused(false)).catch(() => {});
        } else {
            video.pause();
            setIsPaused(true);
        }
    };

    return (
        <div
            className={`group relative p-[2.5px] rounded-[2.8rem] transition-all duration-700 shadow-2xl shrink-0 cursor-pointer ${
                isActive
                    ? 'bg-gradient-to-tr from-[#E8730A] via-[#F2A52B] to-[#8B4513] scale-100'
                    : 'bg-transparent scale-90'
            }`}
            onClick={togglePlay}
        >
            <div className="relative w-full aspect-[9/16] bg-[#1A0E05] rounded-[2.6rem] overflow-hidden">
                <video
                    ref={videoRef}
                    src={reel.url}
                    loop
                    muted={isMuted}
                    playsInline
                    className="absolute inset-0 w-full h-full object-cover"
                />

                {/* Fallback placeholder when video doesn't load */}
                <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-[#2A1508] to-[#1A0E05] z-0">
                    <span className="text-6xl opacity-30">{reel.emoji}</span>
                </div>

                {/* Progress Bar */}
                <div className="absolute top-0 left-0 right-0 h-1 bg-white/10 z-20">
                    <div
                        className="h-full bg-[#E8730A] transition-all duration-100"
                        style={{ width: `${progress}%` }}
                    />
                </div>

                {/* Overlay */}
                <div className={`absolute inset-0 bg-gradient-to-t from-[#1A0E05]/95 via-transparent to-[#1A0E05]/20 z-10 transition-opacity duration-500 ${isActive ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}>
                    {/* User Info & Caption */}
                    <div className="absolute bottom-6 left-5 right-14 text-white text-left pointer-events-none">
                        <div className="flex items-center gap-2.5 mb-2.5">
                            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#E8730A] to-[#8B4513] p-[1.5px] flex-shrink-0">
                                <div className="w-full h-full rounded-full bg-[#1A0E05] flex items-center justify-center text-[9px] font-black text-[#F2A52B]">T</div>
                            </div>
                            <div className="flex flex-col">
                                <span className="text-[10px] font-bold tracking-wide flex items-center gap-1.5 text-white">
                                    {reel.user}
                                    <div className="w-3 h-3 bg-[#E8730A] rounded-full flex items-center justify-center">
                                        <svg viewBox="0 0 24 24" className="w-1.5 h-1.5 text-white fill-current"><path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z" /></svg>
                                    </div>
                                </span>
                            </div>
                        </div>
                        <p className="text-[10px] font-light line-clamp-2 leading-relaxed opacity-80 tracking-wide text-orange-100">
                            {reel.caption}
                        </p>
                    </div>

                    {/* Interaction Column */}
                    <div className="absolute bottom-6 right-3 flex flex-col gap-4 text-white items-center z-20">
                        <div className="flex flex-col items-center gap-1 cursor-pointer group/action">
                            <div className="p-2 sm:p-2.5 bg-[#E8730A]/20 backdrop-blur-xl rounded-full border border-[#E8730A]/30 hover:bg-[#E8730A]/40 transition-all active:scale-90">
                                <Heart size={18} className="transition-colors group-hover/action:fill-[#F2A52B] group-hover/action:text-[#F2A52B]" />
                            </div>
                            <span className="text-[10px] font-bold tracking-tighter">{reel.likes}</span>
                        </div>

                        <div className="flex flex-col items-center gap-1 cursor-pointer">
                            <div className="p-2 sm:p-2.5 bg-white/10 backdrop-blur-xl rounded-full border border-white/10 hover:bg-white/20 transition-all">
                                <MessageCircle size={18} />
                            </div>
                            <span className="text-[10px] font-bold tracking-tighter">32</span>
                        </div>

                        <button className="p-2 sm:p-2.5 bg-white/10 backdrop-blur-xl rounded-full border border-white/10 hover:bg-white/20 transition-all" onClick={(e) => e.stopPropagation()}>
                            <Send size={16} />
                        </button>

                        <button className="p-2 sm:p-2.5 bg-white/10 backdrop-blur-xl rounded-full border border-white/10 hover:bg-white/20 transition-all" onClick={(e) => e.stopPropagation()}>
                            <Bookmark size={16} />
                        </button>
                    </div>

                    {/* Mute Toggle */}
                    <button
                        onClick={(e) => { e.stopPropagation(); toggleMute(); }}
                        className="absolute top-5 right-5 p-2.5 bg-black/50 backdrop-blur-2xl rounded-xl text-white border border-white/10 hover:bg-black/70 transition-all active:scale-90 z-20"
                    >
                        {isMuted ? <VolumeX size={14} /> : <Volume2 size={14} />}
                    </button>
                </div>

                {/* Play indicator */}
                {isPaused && isActive && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/10 pointer-events-none z-10">
                        <div className="w-16 h-16 rounded-full bg-[#E8730A]/20 backdrop-blur-xl flex items-center justify-center border border-[#E8730A]/30">
                            <div className="w-0 h-0 border-t-[10px] border-t-transparent border-l-[18px] border-l-white border-b-[10px] border-b-transparent ml-1.5" />
                        </div>
                    </div>
                )}

                {!isActive && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/40 backdrop-blur-[2px] transition-all z-10">
                        <div className="w-14 h-14 rounded-full bg-[#E8730A]/10 backdrop-blur-xl flex items-center justify-center border border-[#E8730A]/20">
                            <div className="w-0 h-0 border-t-[8px] border-t-transparent border-l-[14px] border-l-white border-b-[8px] border-b-transparent ml-1" />
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

export default function ReelsSection() {
    const [activeIndex, setActiveIndex] = useState(2);
    const [isMuted, setIsMuted] = useState(true);
    const scrollContainerRef = useRef(null);

    useEffect(() => {
        const timeout = setTimeout(() => {
            if (scrollContainerRef.current) {
                const items = scrollContainerRef.current.querySelectorAll('.snap-center');
                items[2]?.scrollIntoView({ behavior: 'auto', block: 'nearest', inline: 'center' });
            }
        }, 100);
        return () => clearTimeout(timeout);
    }, []);

    useEffect(() => {
        const handleScroll = () => {
            if (!scrollContainerRef.current) return;
            const container = scrollContainerRef.current;
            const scrollCenter = container.scrollLeft + container.offsetWidth / 2;
            const items = container.querySelectorAll('.snap-center');

            let closestIndex = 0, closestDistance = Infinity;
            items.forEach((item, index) => {
                const distance = Math.abs(scrollCenter - (item.offsetLeft + item.offsetWidth / 2));
                if (distance < closestDistance) { closestDistance = distance; closestIndex = index; }
            });

            if (closestIndex !== activeIndex) setActiveIndex(closestIndex);
        };

        const container = scrollContainerRef.current;
        container?.addEventListener('scroll', handleScroll, { passive: true });
        return () => container?.removeEventListener('scroll', handleScroll);
    }, [activeIndex]);

    return (
        <section className="py-20 bg-[#FFF8E7] dark:bg-[#0D0703] overflow-hidden border-t border-orange-100/60 dark:border-orange-900/20">
            <div className="max-w-4xl mx-auto px-4 text-center mb-12">
                <span className="text-[10px] font-black uppercase tracking-[0.5em] text-[#E8730A]/60 mb-3 block">Follow Us</span>
                <h2
                    className="text-3xl sm:text-4xl font-bold tracking-tight text-[#1A0E05] dark:text-orange-100 mb-4"
                    style={{ fontFamily: 'var(--font-playfair), serif' }}
                >
                    THEKUA In Motion
                </h2>
                <div className="flex items-center justify-center gap-3 mb-5">
                    <div className="h-px w-8 bg-[#E8730A]/30" />
                    <span className="text-[#E8730A]">✦</span>
                    <div className="h-px w-8 bg-[#E8730A]/30" />
                </div>
                <p className="text-[#8B4513]/60 dark:text-orange-300/50 text-sm font-normal max-w-sm mx-auto leading-relaxed">
                    Watch us craft your favourite snacks, one batch at a time. Follow{' '}
                    <span className="font-bold text-[#E8730A]">@thekua.snacks</span> for daily updates.
                </p>
            </div>

            <div className="relative">
                <div
                    ref={scrollContainerRef}
                    className="flex gap-6 overflow-x-auto pb-8 px-[10%] sm:px-[30%] scroll-smooth snap-x snap-mandatory"
                    style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
                >
                    {REELS.map((reel, index) => (
                        <div
                            key={reel.id}
                            className="w-[260px] sm:w-[280px] snap-center shrink-0 transition-all duration-700"
                            style={{
                                opacity: activeIndex === index ? 1 : 0.4,
                                transform: activeIndex === index ? 'scale(1)' : 'scale(0.85)',
                                filter: activeIndex === index ? 'blur(0)' : 'blur(1px)'
                            }}
                        >
                            <ReelCard
                                reel={reel}
                                isActive={activeIndex === index}
                                isMuted={isMuted}
                                toggleMute={(e) => { e?.stopPropagation?.(); setIsMuted(!isMuted); }}
                            />
                        </div>
                    ))}
                </div>

                {/* Progress dots */}
                <div className="flex justify-center gap-1.5 mt-4">
                    {REELS.map((_, i) => (
                        <div
                            key={i}
                            className={`h-1.5 rounded-full transition-all duration-500 ${activeIndex === i ? 'w-8 bg-[#E8730A]' : 'w-2 bg-orange-200 dark:bg-orange-900/40'}`}
                        />
                    ))}
                </div>
            </div>
        </section>
    );
}
