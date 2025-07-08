import { useRef, useState, useCallback, useEffect } from 'react';
import Slider from 'react-slick';
import type { Settings } from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import { NextArrow, PrevArrow } from './components/CustomArrows';
import StarRating from './components/StarRating';
import './App.css';

interface Product {
  id: number;
  name: string;
  popularity_score: number;
  weight: number;
  image_yellow: string;
  image_rose: string;
  image_white: string;
  price: number;
}

function App() {
  const sliderRef = useRef<Slider>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const thumbRef = useRef<HTMLDivElement>(null);
  const [scrollPosition, setScrollPosition] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [startPosition, setStartPosition] = useState(0);
  const [activeColor, setActiveColor] = useState<string | null>('#E6CA97');
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  
  const colorButtons = [
    { id: 1, color: '#E6CA97', name: 'Yellow Gold', key: 'yellow' },
    { id: 2, color: '#D9D9D9', name: 'White Gold', key: 'white' },
    { id: 3, color: '#E1A4A9', name: 'Rose Gold', key: 'rose' }
  ];

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch(import.meta.env.VITE_API_URL+'/prod/productlist');
        const text = await response.text();
        
        // Extract JSON from the HTML response
        const jsonStart = text.indexOf('[');
        const jsonEnd = text.lastIndexOf(']') + 1;
        const jsonString = text.slice(jsonStart, jsonEnd);
        
        const data = JSON.parse(jsonString);
        setProducts(data);
      } catch (error) {
        console.error('Error fetching products:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // Scrollbar handlers (unchanged)
  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    setIsDragging(true);
    setStartX(e.clientX);
    setStartPosition(scrollPosition);
    document.body.style.cursor = 'grabbing';
  }, [scrollPosition]);

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!isDragging || !trackRef.current || !products.length) return;
    
    const trackWidth = trackRef.current.offsetWidth;
    const thumbWidthPercentage = Math.min(100 / products.length * 4, 20);
    const thumbWidth = (trackWidth * thumbWidthPercentage) / 100;
    const dragDistance = e.clientX - startX;
    const dragPercentage = (dragDistance / (trackWidth - thumbWidth)) * 100;
    
    let newPosition = startPosition + dragPercentage;
    newPosition = Math.max(0, Math.min(newPosition, 100 - thumbWidthPercentage));
    
    setScrollPosition(newPosition);
    
    if (sliderRef.current) {
      const totalSlides = products.length;
      const visibleSlides = 4;
      const maxScroll = Math.max(totalSlides - visibleSlides, 1);
      const targetSlide = Math.round((newPosition / (100 - thumbWidthPercentage)) * maxScroll);
      sliderRef.current.slickGoTo(targetSlide);
    }
  }, [isDragging, startX, startPosition, products.length]);

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
    document.body.style.cursor = '';
  }, []);

  useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [isDragging, handleMouseMove, handleMouseUp]);

  const handleScroll = (currentSlide: number) => {
    if (!products.length) return;
    
    const totalSlides = products.length;
    const visibleSlides = 4;
    const maxScroll = Math.max(totalSlides - visibleSlides, 1);
    const thumbWidthPercentage = Math.min(100 / products.length * 4, 20);
    const position = (currentSlide / maxScroll) * (100 - thumbWidthPercentage);
    setScrollPosition(position);
  };

  const handleScrollbarClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!sliderRef.current || !trackRef.current || !products.length) return;
    
    const track = trackRef.current;
    const thumbWidthPercentage = Math.min(100 / products.length * 4, 20);
    const rect = track.getBoundingClientRect();
    const clickPosition = e.clientX - rect.left;
    const clickPercentage = (clickPosition / rect.width) * (100 - thumbWidthPercentage);
    
    const totalSlides = products.length;
    const visibleSlides = 4;
    const maxScroll = Math.max(totalSlides - visibleSlides, 1);
    const targetSlide = Math.round((clickPercentage / (100 - thumbWidthPercentage)) * maxScroll);
    
    sliderRef.current.slickGoTo(targetSlide);
  };

  const getImageForActiveColor = (product: Product) => {
    const color = colorButtons.find(btn => btn.color === activeColor);
    
    switch (color?.key) {
      case 'white': return product.image_white;
      case 'rose': return product.image_rose;
      default: return product.image_yellow;
    }
  };

  const thumbWidth = Math.min(100 / products.length * 4, 20);
  const settings: Settings = {
    dots: false,
    infinite: false,
    speed: 500,
    slidesToShow: Math.min(4, products.length),
    slidesToScroll: 1,
    nextArrow: <NextArrow />,
    prevArrow: <PrevArrow />,
    arrows: true,
    swipe: true,
    draggable: true,
    responsive: [
      {
        breakpoint: 1024,
        settings: { slidesToShow: Math.min(3, products.length) }
      },
      {
        breakpoint: 768,
        settings: { slidesToShow: Math.min(2, products.length) }
      },
      {
        breakpoint: 480,
        settings: { slidesToShow: 1 }
      }
    ],
    afterChange: handleScroll
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="App">
      <h2 className="product-header text-[45px] p-20 justify-center items-center flex">Product List</h2>
      <div className="w-3/4 mx-auto relative">
        {products.length > 0 ? (
          <>
            <div className="carousel-container">
              <Slider ref={sliderRef} {...settings}>
                {products.map((product) => (
                  <div key={product.id} className="px-2">
                    <div className="h-90 w-60 rounded-b-full flex flex-col justify-center p-6">
                      <img 
                        src={getImageForActiveColor(product)} 
                        alt={product.name} 
                        className="h-80 w-45 rounded-lg object-cover mb-4"
                      />
                      <h3 className="prod-header text-[15px]">{product.name}</h3>
                      <p className="price-header text-[15px] mt-1">${product.price.toFixed(2)}</p>
                      <div className="flex gap-2 p-1">
                        {colorButtons.map((btn) => (
                          <button
                            key={btn.id}
                            className={`w-4 h-4 mt-2 rounded-full ${activeColor === btn.color ? 'outline outline-offset-3 outline-black' : 'outline-none'}`}
                            style={{ backgroundColor: btn.color }}
                            onClick={() => setActiveColor(btn.color)}
                            aria-label={btn.name}
                            title={btn.name}
                          />
                        ))}
                      </div>
                      <p className="product-header text-xs mt-1">
                        {colorButtons.find(btn => btn.color === activeColor)?.name || 'Yellow Gold'}
                      </p>
                      <StarRating rating={product.popularity_score} color="#f6d5a8" size='lg' />
                    </div>
                  </div>
                ))}
              </Slider>
            </div>
            
            {products.length > 4 && (
              <div className="custom-scrollbar mt-4">
                <div 
                  ref={trackRef}
                  className="scrollbar-track"
                  onClick={handleScrollbarClick}
                >
                  <div 
                    ref={thumbRef}
                    className="scrollbar-thumb"
                    style={{ 
                      width: `${thumbWidth}%`,
                      left: `${scrollPosition}%`,
                      cursor: isDragging ? 'grabbing' : 'grab'
                    }}
                    onMouseDown={handleMouseDown}
                  ></div>
                </div>
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-10">No products available</div>
        )}
      </div>
    </div>
  );
}

export default App;