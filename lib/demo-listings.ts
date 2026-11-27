import type { Listing } from '@/lib/marketplace-types'

const day = 86_400_000
const now = Date.parse('2026-11-28T12:00:00Z')

function demoListing(
  index: number,
  category: string,
  categorySlug: string,
  title: string,
  description: string,
  price: number,
  city: string,
  state: string,
  seller: string,
  image: number,
  ageDays: number,
  condition: Listing['condition'] = 'used',
  priceType: Listing['price_type'] = 'fixed',
  listingType: Listing['listing_type'] = 'product',
): Listing {
  return {
    id: `demo-${String(index).padStart(2, '0')}`,
    slug: `demo-${String(index).padStart(2, '0')}-${title.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`,
    title,
    description,
    price,
    price_type: priceType,
    condition,
    listing_type: listingType,
    country: 'India',
    state,
    city,
    area: '',
    images: [`/listings/demo-${String(image).padStart(2, '0')}.png`],
    created_at: new Date(now - ageDays * day).toISOString(),
    category: { name: category, slug: categorySlug },
    seller_name: seller,
    seller_member_since: new Date(now - (ageDays + 220) * day).toISOString(),
    is_demo: true,
  }
}

export const demoListings: Listing[] = [
  demoListing(1, 'Mobiles & Electronics', 'mobiles-electronics', 'iPhone 14 · 128GB', 'Excellent condition, battery health 91%. Includes original box and charging cable.', 31900, 'Varanasi', 'Uttar Pradesh', 'Aarav Sharma', 1, 1, 'used', 'negotiable'),
  demoListing(2, 'Vehicles', 'vehicles', '2022 Honda Activa 6G', 'Single owner, serviced regularly and ready for a test ride. All papers in order.', 66500, 'Delhi', 'Delhi', 'Rohan Mehta', 2, 3),
  demoListing(3, 'Furniture', 'furniture', 'Mid-century teak lounge chair', 'Solid teak frame with recently refreshed upholstery. A beautiful reading corner find.', 8400, 'Mumbai', 'Maharashtra', 'Mira Kulkarni', 3, 4, 'used', 'negotiable'),
  demoListing(4, 'Property', 'property', 'Sunny 2 BHK near the metro', 'Well-kept apartment with balcony, modular kitchen and dedicated parking.', 24500, 'Bengaluru', 'Karnataka', 'Nikhil Rao', 4, 6, 'not_applicable'),
  demoListing(5, 'Mobiles & Electronics', 'mobiles-electronics', 'MacBook Air M2 · 16GB', 'Lightly used, 16GB memory, 512GB storage. Includes charger and sleeve.', 72900, 'Delhi', 'Delhi', 'Aanya Kapoor', 5, 7, 'used', 'negotiable'),
  demoListing(6, 'Fashion', 'fashion', 'Hand-finished leather sneakers', 'Worn twice, size UK 8. Crafted leather with original box.', 4200, 'Jaipur', 'Rajasthan', 'Kabir Singh', 6, 8, 'new'),
  demoListing(7, 'Home Appliances', 'home-appliances', 'Samsung 253L inverter fridge', 'Energy-efficient double door refrigerator, two years old and in great shape.', 14500, 'Lucknow', 'Uttar Pradesh', 'Neha Verma', 7, 9, 'used', 'negotiable'),
  demoListing(8, 'Sports & Fitness', 'sports-fitness', 'Adjustable dumbbell set · 20kg', 'Space-saving pair with five weight settings. Barely used.', 3800, 'Hyderabad', 'Telangana', 'Dev Reddy', 8, 10),
  demoListing(9, 'Books & Education', 'books-education', 'Designing with Type · 5th edition', 'A much-loved typography reference in excellent condition. No markings.', 950, 'Kolkata', 'West Bengal', 'Ishita Bose', 9, 11),
  demoListing(10, 'Vehicles', 'vehicles', 'Royal Enfield Classic 350', '2021 model, 14,000 km, tasteful accessories and full service history.', 156000, 'Kanpur', 'Uttar Pradesh', 'Arjun Mishra', 10, 12, 'used', 'negotiable'),
  demoListing(11, 'Furniture', 'furniture', 'Handcrafted oak coffee table', 'Solid oak, made by a local craftsman. Small surface marks, structurally perfect.', 6900, 'Pune', 'Maharashtra', 'Tara Desai', 11, 13, 'used', 'negotiable'),
  demoListing(12, 'Services', 'services', 'Weekend home deep-cleaning', 'Reliable two-person team with all supplies included. Available across South Delhi.', 1800, 'Delhi', 'Delhi', 'Pooja Arora', 12, 14, 'not_applicable', 'fixed', 'service'),
  demoListing(13, 'Property', 'property', 'Independent 3 BHK with garden', 'Quiet, sun-filled home with a private garden and easy access to the ring road.', 38000, 'Jaipur', 'Rajasthan', 'Sameer Jain', 13, 15, 'not_applicable'),
  demoListing(14, 'Mobiles & Electronics', 'mobiles-electronics', 'Fujifilm X-T30 II body', 'Compact mirrorless camera body with two batteries and a leather strap.', 58500, 'Bengaluru', 'Karnataka', 'Ananya Iyer', 14, 16, 'used', 'negotiable'),
  demoListing(15, 'Fashion', 'fashion', 'Minimal automatic field watch', '38mm brushed steel case, sapphire glass and original travel case.', 11800, 'Hyderabad', 'Telangana', 'Sana Khan', 15, 17, 'used', 'negotiable'),
  demoListing(16, 'Pets', 'pets', 'Handwoven pet bed · medium', 'Natural cotton rope, washable cushion insert. Fits medium-sized dogs.', 2200, 'Kolkata', 'West Bengal', 'Ritika Das', 16, 18, 'new'),
  demoListing(17, 'Home Appliances', 'home-appliances', 'Espresso machine with grinder', 'Well-maintained home espresso setup with portafilter and milk jug.', 11900, 'Mumbai', 'Maharashtra', 'Omar Shaikh', 17, 19, 'used', 'negotiable'),
  demoListing(18, 'Services', 'services', 'One-to-one maths tutoring', 'Patient, experienced tutor for classes 8–12. Online or at your home.', 650, 'Varanasi', 'Uttar Pradesh', 'Ankit Dubey', 18, 20, 'not_applicable', 'fixed', 'service'),
  demoListing(19, 'Vehicles', 'vehicles', '2019 Hyundai i20 Sportz', 'Well-kept petrol manual, 38,000 km, second owner with complete service record.', 545000, 'Lucknow', 'Uttar Pradesh', 'Priya Gupta', 19, 21, 'used', 'negotiable'),
  demoListing(20, 'Other', 'other', 'Vintage film camera collection', 'Three working 35mm cameras from the 1970s and 80s. Sold as a set.', 13200, 'Delhi', 'Delhi', 'Vikram Bhatia', 20, 22, 'used', 'negotiable'),
]
