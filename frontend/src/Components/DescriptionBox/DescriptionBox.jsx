import React from 'react'
import "./DescriptionBox.css"

const DescriptionBox = () => {
  return (
    <div className='descriptionbox'>
        <div className="descriptionbox-navigator">
            <div className="descriptionbox-nav-box">Description</div>
            <div className="descriptionbox-nav-box fade">Reviews(122)</div>
        </div>
        <div className="descriptionbox-description">
            <p>
                Experience refined shopping at its finest. Our collection is thoughtfully curated to bring you products that embody elegance, superior craftsmanship, and timeless quality. Every detail—from selection to packaging—is designed to reflect sophistication and exclusivity. We believe luxury is not just about appearance, but about excellence, trust, and an exceptional experience delivered consistently. Discover pieces that elevate your lifestyle and redefine everyday indulgence.
            </p>
            <p>
                Welcome to our store, your one-stop destination for high-quality products at honest prices. We are committed to offering a seamless shopping experience with carefully curated items, secure payments, and reliable delivery. Every product is selected to meet our standards of quality, durability, and value, ensuring customer satisfaction at every step. Whether you’re shopping for everyday essentials or something special, we strive to make your experience simple, enjoyable, and dependable.
            </p>
        </div>
    </div>
  )
}

export default DescriptionBox