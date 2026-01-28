import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ShoppingCart, Search } from 'lucide-react';
import { Link } from 'react-router';
import axios from 'axios';

interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
}

export function ProductsPage() {
  const API_URL = import.meta.env.VITE_HOST;
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [produts, setProducts] = useState<Product[]>([]);

  const mockProducts: Product[] = [
    {
      id: 1,
      name: 'Pizza Margherita',
      description: 'Classic Italian pizza with tomato, mozzarella and basil',
      price: 12.99,
      image: 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=400',
      category: 'Pizza',
    },
    {
      id: 2,
      name: 'Hamburguesa Clásica',
      description: 'Beef burger with lettuce, tomato, cheese and special sauce',
      price: 9.99,
      image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400',
      category: 'Burgers',
    },
    {
      id: 3,
      name: 'Sushi Roll',
      description: 'Fresh salmon and avocado roll with soy sauce',
      price: 15.99,
      image: 'https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?w=400',
      category: 'Sushi',
    },
    {
      id: 4,
      name: 'Pasta Carbonara',
      description: 'Creamy pasta with bacon, egg and parmesan cheese',
      price: 11.99,
      image: 'https://images.unsplash.com/photo-1612874742237-6526221588e3?w=400',
      category: 'Pasta',
    },
    {
      id: 5,
      name: 'Caesar Salad',
      description: 'Fresh romaine lettuce with caesar dressing and croutons',
      price: 8.99,
      image: 'https://images.unsplash.com/photo-1546793665-c74683f339c1?w=400',
      category: 'Salads',
    },
    {
      id: 6,
      name: 'Tacos al Pastor',
      description: 'Three tacos with marinated pork, pineapple and cilantro',
      price: 10.99,
      image: 'https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=400',
      category: 'Mexican',
    },
  ];

  const categories = ['all', ...Array.from(new Set(mockProducts.map(p => p.category)))];

  const filteredProducts = mockProducts.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });
  
  useEffect(
    () => {
      getProducts()
    },[]
  )
  
  const getProducts = async () => {
    const response = await axios.get(`${API_URL}/products`);
    console.log(response.data);
    setProducts(response.data);
  }

  const handleAddToCart = (product: Product) => {
    console.log('Adding to cart:', product);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-4xl font-bold mb-2">Nuestros Productos</h1>
              <p className="text-muted-foreground">Descubre nuestra deliciosa selección</p>
            </div>
            <Link to="/cart">
              <Button size="lg" className="gap-2">
                <ShoppingCart className="size-5" />
                Ver Carrito
              </Button>
            </Link>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Buscar productos..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex gap-2 flex-wrap">
              {categories.map(category => (
                <Button
                  key={category}
                  variant={selectedCategory === category ? 'default' : 'outline'}
                  onClick={() => setSelectedCategory(category)}
                  className="capitalize"
                >
                  {category === 'all' ? 'Todos' : category}
                </Button>
              ))}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {produts.map(product => (
            <Card key={product.id} className="overflow-hidden hover:shadow-lg transition-shadow">
              <div className="aspect-video overflow-hidden bg-gray-200">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                />
              </div>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle>{product.name}</CardTitle>
                    <CardDescription className="mt-1">{product.category}</CardDescription>
                  </div>
                  <span className="text-2xl font-bold text-primary">
                    ${product.price.toFixed(2)}
                  </span>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">{product.description}</p>
              </CardContent>
              <CardFooter>
                <Button 
                  className="w-full gap-2" 
                  onClick={() => handleAddToCart(product)}
                >
                  <ShoppingCart className="size-4" />
                  Agregar al Carrito
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>

        {filteredProducts.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground text-lg">No se encontraron productos</p>
          </div>
        )}
      </div>
    </div>
  );
}
