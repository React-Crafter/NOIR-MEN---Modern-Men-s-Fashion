import panjabiImg from '../assets/images/category_panjabi_1790217944904.jpg';
import tshirtImg from '../assets/images/category_tshirt_1790217958167.jpg';
import shirtImg from '../assets/images/category_shirt_1790217968360.jpg';
import pantsImg from '../assets/images/category_pants_1790217977864.jpg';
import heroImg from '../assets/images/hero_noir_men_1790217929182.jpg';

export const PRODUCTS = [
  // ---------------- PANJABI (6 items) ----------------
  {
    id: 'nm-pj-01',
    name: 'The Onyx Signature Silk Panjabi',
    category: 'Panjabi',
    categorySlug: 'panjabi',
    price: 3450,
    previousPrice: 3950,
    discount: 13,
    images: [
      panjabiImg,
      heroImg
    ],
    colors: [
      { name: 'Onyx Black', hex: '#111111' },
      { name: 'Midnight Navy', hex: '#1A2434' },
      { name: 'Deep Charcoal', hex: '#2C2E33' }
    ],
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    stock: 14,
    description: 'A hallmark of modern festive elegance. Tailored from a premium silk-viscose blend with fine geometric placket embroidery, tonal metallic buttons, and a tapered slim silhouette designed for Eid and signature evening occasions.',
    fabric: '85% Mulberry Silk, 15% Fine Viscose',
    fit: 'Modern Tailored Fit (semi-fitted chest with clean drape)',
    careInstructions: 'Dry clean recommended. Gentle hand wash in cool water with mild silk detergent. Iron inside out on low heat.',
    isNew: true,
    isFeatured: true,
    isPopular: true,
  },
  {
    id: 'nm-pj-02',
    name: 'Midnight Jacquard Embroidered Panjabi',
    category: 'Panjabi',
    categorySlug: 'panjabi',
    price: 2850,
    previousPrice: 3200,
    discount: 11,
    images: [
      panjabiImg,
      heroImg
    ],
    colors: [
      { name: 'Midnight Navy', hex: '#162238' },
      { name: 'Royal Emerald', hex: '#143026' }
    ],
    sizes: ['M', 'L', 'XL', 'XXL'],
    stock: 18,
    description: 'Intricately woven self-jacquard fabric accented by delicate needlework across the mandarin collar and cuffs. Lightweight yet structured for humid Dhaka evenings.',
    fabric: '100% Mercerized Egyptian Combed Cotton',
    fit: 'Regular Tailored Cut',
    careInstructions: 'Machine wash delicate cycle in cold water. Do not bleach. Steam iron while slightly damp.',
    isNew: true,
    isFeatured: true,
    isPopular: false,
  },
  {
    id: 'nm-pj-03',
    name: 'Chalk White Minimalist Linen Panjabi',
    category: 'Panjabi',
    categorySlug: 'panjabi',
    price: 2450,
    previousPrice: 2750,
    discount: 11,
    images: [
      panjabiImg,
      shirtImg
    ],
    colors: [
      { name: 'Chalk White', hex: '#F5F5F0' },
      { name: 'Sand Ecru', hex: '#E2DCBE' }
    ],
    sizes: ['S', 'M', 'L', 'XL'],
    stock: 22,
    description: 'Purist aesthetics meeting airy summer comfort. Crafted from pure organic flax linen with concealed placket snap buttons and discreet side slit pockets.',
    fabric: '100% Washed European Flax Linen',
    fit: 'Relaxed Tailored Drape',
    careInstructions: 'Cold hand wash with gentle detergent. Hang dry in shade. Light linen wrinkling is natural and celebrated.',
    isNew: false,
    isFeatured: false,
    isPopular: true,
  },
  {
    id: 'nm-pj-04',
    name: 'Emerald Festive Cotton-Lurex Panjabi',
    category: 'Panjabi',
    categorySlug: 'panjabi',
    price: 2950,
    previousPrice: 3400,
    discount: 13,
    images: [
      panjabiImg,
      heroImg
    ],
    colors: [
      { name: 'Forest Emerald', hex: '#123524' },
      { name: 'Rich Wine', hex: '#4A1521' }
    ],
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    stock: 9,
    description: 'Subtle metallic thread weaving through deep emerald green cotton. Finished with custom antique brass buttons for celebratory gatherings and wedding receptions.',
    fabric: '95% Combed Long-Staple Cotton, 5% Lurex Yarn',
    fit: 'Slim Modern Fit',
    careInstructions: 'Hand wash cold separately. Do not wring. Warm iron on reverse side.',
    isNew: true,
    isFeatured: true,
    isPopular: true,
  },
  {
    id: 'nm-pj-05',
    name: 'Slate Dobby Textured Daily Panjabi',
    category: 'Panjabi',
    categorySlug: 'panjabi',
    price: 1850,
    previousPrice: 2100,
    discount: 12,
    images: [
      panjabiImg,
      tshirtImg
    ],
    colors: [
      { name: 'Slate Gray', hex: '#4A5568' },
      { name: 'Earth Taupe', hex: '#63534B' }
    ],
    sizes: ['M', 'L', 'XL'],
    stock: 30,
    description: 'The definitive daily driver. Micro-dobby geometric texture that resists creases and breathes effortlessly during Friday prayers, family brunches, and casual workdays.',
    fabric: '100% Breathable Dobby Weave Cotton',
    fit: 'Classic Comfort Cut',
    careInstructions: 'Regular machine wash cold. Tumble dry low or air dry.',
    isNew: false,
    isFeatured: false,
    isPopular: false,
  },
  {
    id: 'nm-pj-06',
    name: 'Royal Indigo Semi-Silk Panjabi',
    category: 'Panjabi',
    categorySlug: 'panjabi',
    price: 3200,
    previousPrice: 3600,
    discount: 11,
    images: [
      panjabiImg,
      heroImg
    ],
    colors: [
      { name: 'Royal Indigo', hex: '#1C2951' },
      { name: 'Jet Obsidian', hex: '#18181A' }
    ],
    sizes: ['S', 'M', 'L', 'XL'],
    stock: 12,
    description: 'Lustrous deep indigo sheen tailored with sharp minimalist shoulder construction, standing band collar, and premium engraved resin buttons.',
    fabric: '70% Viscose Silk, 30% Fine Cotton',
    fit: 'Tailored Silhouette',
    careInstructions: 'Dry clean recommended. Gentle cold rinse only.',
    isNew: false,
    isFeatured: true,
    isPopular: true,
  },

  // ---------------- T-SHIRTS (5 items) ----------------
  {
    id: 'nm-ts-01',
    name: 'Heavyweight Boxy Drop-Shoulder Tee',
    category: 'T-Shirts',
    categorySlug: 't-shirts',
    price: 950,
    previousPrice: 1150,
    discount: 17,
    images: [
      tshirtImg,
      heroImg
    ],
    colors: [
      { name: 'Mineral Black', hex: '#1F1F1F' },
      { name: 'Washed Olive', hex: '#3B4136' },
      { name: 'Raw Bone', hex: '#ECE7DC' }
    ],
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    stock: 45,
    description: 'Crafted from dense 260 GSM combed cotton for a sculpted streetwear silhouette. Features reinforced twin-needle stitching, rib-knit collar that will never bacon, and a relaxed boxy cut.',
    fabric: '100% Combed Compact Cotton (260 GSM)',
    fit: 'Oversized Boxy Fit with Dropped Shoulders',
    careInstructions: 'Cold machine wash inside out. Tumble dry gentle. Do not iron over prints/labels.',
    isNew: true,
    isFeatured: true,
    isPopular: true,
  },
  {
    id: 'nm-ts-02',
    name: 'Supima Luxury Cotton Crew Neck',
    category: 'T-Shirts',
    categorySlug: 't-shirts',
    price: 850,
    previousPrice: 990,
    discount: 14,
    images: [
      tshirtImg,
      shirtImg
    ],
    colors: [
      { name: 'Chalk White', hex: '#FAFAFA' },
      { name: 'Heather Gray', hex: '#9CA3AF' },
      { name: 'Midnight Navy', hex: '#1B263B' }
    ],
    sizes: ['S', 'M', 'L', 'XL'],
    stock: 35,
    description: 'Silky smooth extra-long staple Supima cotton with zero pill resistance. The ultimate understated luxury base layer under unbuttoned shirts and blazers.',
    fabric: '100% Supima Extra-Long Staple Cotton (200 GSM)',
    fit: 'Tailored Regular Fit',
    careInstructions: 'Machine wash cold with like colors. Warm iron if needed.',
    isNew: false,
    isFeatured: true,
    isPopular: true,
  },
  {
    id: 'nm-ts-03',
    name: 'Waffle Knit Relaxed Minimal Tee',
    category: 'T-Shirts',
    categorySlug: 't-shirts',
    price: 1150,
    previousPrice: 1350,
    discount: 15,
    images: [
      tshirtImg,
      pantsImg
    ],
    colors: [
      { name: 'Sage Olive', hex: '#4B5548' },
      { name: 'Warm Taupe', hex: '#6E6259' }
    ],
    sizes: ['M', 'L', 'XL', 'XXL'],
    stock: 20,
    description: 'Dimensional thermal waffle weave offering tactile depth and optimal air circulation in warm climates. Finished with split side-seam hems.',
    fabric: '100% Honeycomb Waffle Cotton',
    fit: 'Relaxed Fit',
    careInstructions: 'Gentle cycle wash cold. Reshape and lay flat to dry.',
    isNew: true,
    isFeatured: false,
    isPopular: false,
  },
  {
    id: 'nm-ts-04',
    name: 'Mercerized Compact Cotton Tee',
    category: 'T-Shirts',
    categorySlug: 't-shirts',
    price: 990,
    previousPrice: 1200,
    discount: 18,
    images: [
      tshirtImg,
      heroImg
    ],
    colors: [
      { name: 'Deep Navy', hex: '#172033' },
      { name: 'Burgundy', hex: '#421721' }
    ],
    sizes: ['S', 'M', 'L', 'XL'],
    stock: 28,
    description: 'Double mercerized treatment grants this tee a subtle silk-like luster, deep color retention, and exceptional drape that stays crisp wash after wash.',
    fabric: '100% Double-Mercerized Egyptian Cotton',
    fit: 'Slim Tailored Fit',
    careInstructions: 'Hand or delicate machine wash cold. Do not tumble dry.',
    isNew: false,
    isFeatured: false,
    isPopular: true,
  },
  {
    id: 'nm-ts-05',
    name: 'Essential Heavy Raw Hem Tee',
    category: 'T-Shirts',
    categorySlug: 't-shirts',
    price: 750,
    previousPrice: 900,
    discount: 17,
    images: [
      tshirtImg,
      pantsImg
    ],
    colors: [
      { name: 'Heather Charcoal', hex: '#374151' },
      { name: 'Muted Mocha', hex: '#584C42' }
    ],
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    stock: 50,
    description: 'An effortless daily staple. Vintage garment washed for ultra-soft hand feel, reinforced neckline, and raw rolled bottom hem detail.',
    fabric: '100% Garment-Dyed Cotton (220 GSM)',
    fit: 'Regular Casual Cut',
    careInstructions: 'Machine wash warm with similar shades. Low tumble dry.',
    isNew: false,
    isFeatured: false,
    isPopular: false,
  },

  // ---------------- SHIRTS (5 items) ----------------
  {
    id: 'nm-sh-01',
    name: 'Band Collar Oxford Linen Shirt',
    category: 'Shirts',
    categorySlug: 'shirts',
    price: 1650,
    previousPrice: 1950,
    discount: 15,
    images: [
      shirtImg,
      panjabiImg
    ],
    colors: [
      { name: 'Pure White', hex: '#FFFFFF' },
      { name: 'Sky Chambray', hex: '#A3B8CC' }
    ],
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    stock: 19,
    description: 'Clean mandarin standing collar shirt in washed flax linen with genuine mother-of-pearl buttons. Pairs seamlessly with tailored chinos or draped over a tank.',
    fabric: '70% Washed Linen, 30% Fine Cotton',
    fit: 'Modern Slim Fit',
    careInstructions: 'Machine wash cold on delicate. Hang while damp. Steam or warm iron.',
    isNew: true,
    isFeatured: true,
    isPopular: true,
  },
  {
    id: 'nm-sh-02',
    name: 'Urban Cuban Collar Textured Shirt',
    category: 'Shirts',
    categorySlug: 'shirts',
    price: 1450,
    previousPrice: 1750,
    discount: 17,
    images: [
      shirtImg,
      tshirtImg
    ],
    colors: [
      { name: 'Sand Beige', hex: '#D8CCA8' },
      { name: 'Olive Green', hex: '#4A5B44' },
      { name: 'Midnight', hex: '#1E2530' }
    ],
    sizes: ['S', 'M', 'L', 'XL'],
    stock: 25,
    description: 'Camp collar resort aesthetic reimagined for Dhaka city living. Breathable open-weave texture with relaxed short sleeves and straight boxy hem.',
    fabric: '100% Textured Slub Cotton',
    fit: 'Relaxed Camp Fit',
    careInstructions: 'Machine wash cold delicate. Hang dry in shade.',
    isNew: true,
    isFeatured: true,
    isPopular: true,
  },
  {
    id: 'nm-sh-03',
    name: 'Semi-Formal Premium Twill Shirt',
    category: 'Shirts',
    categorySlug: 'shirts',
    price: 1850,
    previousPrice: 2150,
    discount: 14,
    images: [
      shirtImg,
      pantsImg
    ],
    colors: [
      { name: 'Midnight Blue', hex: '#14213D' },
      { name: 'Crisp White', hex: '#FAFAFA' }
    ],
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    stock: 16,
    description: 'A sharp 100/2 two-ply cotton twill shirt featuring semi-spread collar with removable brass stays, chiselled cuffs, and subtle wrinkle-resistant finish.',
    fabric: '100% Two-Ply Cotton Twill',
    fit: 'Tailored Slim Fit',
    careInstructions: 'Machine wash warm. Warm iron. Starch optional for executive crispness.',
    isNew: false,
    isFeatured: false,
    isPopular: true,
  },
  {
    id: 'nm-sh-04',
    name: 'Striped Breezy Summer Cotton Shirt',
    category: 'Shirts',
    categorySlug: 'shirts',
    price: 1350,
    previousPrice: 1550,
    discount: 13,
    images: [
      shirtImg,
      heroImg
    ],
    colors: [
      { name: 'Slate & Ecru', hex: '#52616B' },
      { name: 'Navy & White', hex: '#1E3D59' }
    ],
    sizes: ['M', 'L', 'XL'],
    stock: 22,
    description: 'Vertical pin-stripes on featherlight cotton poplin. Perfect balance of nonchalance and poise for weekend coffees and casual business meetups.',
    fabric: '100% Lightweight Poplin Cotton',
    fit: 'Regular Fit',
    careInstructions: 'Cold wash with mild detergent. Medium heat iron.',
    isNew: false,
    isFeatured: false,
    isPopular: false,
  },
  {
    id: 'nm-sh-05',
    name: 'Minimalist Mandarin Poplin Shirt',
    category: 'Shirts',
    categorySlug: 'shirts',
    price: 1550,
    previousPrice: 1800,
    discount: 14,
    images: [
      shirtImg,
      panjabiImg
    ],
    colors: [
      { name: 'Olive Mist', hex: '#5E6B56' },
      { name: 'Charcoal Black', hex: '#212529' }
    ],
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    stock: 17,
    description: 'Contemporary standing collar shirt with clean hidden placket and curved hem. Designed to be worn untucked over slim trousers or chinos.',
    fabric: '100% Long-Staple Cotton Poplin',
    fit: 'Modern Tailored Fit',
    careInstructions: 'Machine wash 30°C. Do not tumble dry.',
    isNew: true,
    isFeatured: false,
    isPopular: true,
  },

  // ---------------- PANTS (4 items) ----------------
  {
    id: 'nm-pt-01',
    name: 'Tailored Tech Stretch Chino',
    category: 'Pants',
    categorySlug: 'pants',
    price: 1950,
    previousPrice: 2300,
    discount: 15,
    images: [
      pantsImg,
      heroImg
    ],
    colors: [
      { name: 'Charcoal Gray', hex: '#374151' },
      { name: 'Desert Khaki', hex: '#A39171' },
      { name: 'Deep Navy', hex: '#1C2541' }
    ],
    sizes: ['30', '32', '34', '36', '38'],
    stock: 24,
    description: 'Engineered with 4-way stretch twill for all-day mobility without losing structure. Features a hidden inner zip coin pocket and clean blind hems.',
    fabric: '97% Combed Cotton, 3% Elastane',
    fit: 'Slim-Tapered Leg',
    careInstructions: 'Machine wash cold inside out. Tumble dry low or air dry.',
    isNew: true,
    isFeatured: true,
    isPopular: true,
  },
  {
    id: 'nm-pt-02',
    name: 'Pleated Relaxed Cotton Trousers',
    category: 'Pants',
    categorySlug: 'pants',
    price: 2150,
    previousPrice: 2500,
    discount: 14,
    images: [
      pantsImg,
      shirtImg
    ],
    colors: [
      { name: 'Warm Khaki', hex: '#C2B280' },
      { name: 'Smoky Black', hex: '#18181B' }
    ],
    sizes: ['30', '32', '34', '36'],
    stock: 15,
    description: 'Single front pleat with a modern relaxed straight drape. Side adjusters at the waistband eliminate the need for a belt while honoring sartorial traditions.',
    fabric: '100% Heavy Twill Cotton',
    fit: 'Relaxed Straight Cut with Subtle Taper',
    careInstructions: 'Dry clean or cold delicate wash. Press pleats with steam iron.',
    isNew: true,
    isFeatured: true,
    isPopular: false,
  },
  {
    id: 'nm-pt-03',
    name: 'Smart Drawstring Linen-Blend Trouser',
    category: 'Pants',
    categorySlug: 'pants',
    price: 1750,
    previousPrice: 2050,
    discount: 15,
    images: [
      pantsImg,
      tshirtImg
    ],
    colors: [
      { name: 'Deep Olive', hex: '#3D4A39' },
      { name: 'Natural Sand', hex: '#D7C9AA' }
    ],
    sizes: ['S (30)', 'M (32)', 'L (34)', 'XL (36)'],
    stock: 28,
    description: 'Hybrid comfort meets sartorial sophistication. Elasticated back waistband with internal drawstring, flat front, and cropped ankles suited for loafers or clean sneakers.',
    fabric: '55% Linen, 45% Cotton',
    fit: 'Tapered Easy Fit',
    careInstructions: 'Hand wash cold or gentle machine cycle. Air dry flat.',
    isNew: false,
    isFeatured: false,
    isPopular: true,
  },
  {
    id: 'nm-pt-04',
    name: 'Slim-Fit Structured Work Pant',
    category: 'Pants',
    categorySlug: 'pants',
    price: 1850,
    previousPrice: 2200,
    discount: 16,
    images: [
      pantsImg,
      heroImg
    ],
    colors: [
      { name: 'Jet Black', hex: '#111111' },
      { name: 'Graphite Ash', hex: '#4B5563' }
    ],
    sizes: ['30', '32', '34', '36', '38'],
    stock: 31,
    description: 'High-density micro-twill with natural recovery. Crisp front crease, reinforced belt loops, and welt back pockets tailored for corporate and semi-formal wear.',
    fabric: '96% Cotton, 4% Spandex Twill',
    fit: 'Tailored Slim Cut',
    careInstructions: 'Machine wash 40°C. Medium iron for sharp crease lines.',
    isNew: false,
    isFeatured: false,
    isPopular: false,
  }
];

export const SIZES_LIST = ['S', 'M', 'L', 'XL', 'XXL'];
