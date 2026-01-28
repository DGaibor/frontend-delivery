import { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Minus, Plus, Trash2, ShoppingBag, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router';

interface CartItem {
  id: number;
  name: string;
  price: number;
  quantity: number;
  image: string;
}

export function CartPage() {
  const [cartItems, setCartItems] = useState<CartItem[]>([
    {
      id: 1,
      name: 'Pizza Margherita',
      price: 12.99,
      quantity: 2,
      image: 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=400',
    },
    {
      id: 2,
      name: 'Hamburguesa Clásica',
      price: 9.99,
      quantity: 1,
      image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400',
    },
  ]);

  const [orderDetails, setOrderDetails] = useState({
    description: '',
    address: '',
    phone: '',
  });

  const updateQuantity = (id: number, change: number) => {
    setCartItems(items =>
      items.map(item =>
        item.id === id
          ? { ...item, quantity: Math.max(1, item.quantity + change) }
          : item
      )
    );
  };

  const removeItem = (id: number) => {
    setCartItems(items => items.filter(item => item.id !== id));
  };

  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const tax = subtotal * 0.12;
  const delivery = 2.99;
  const total = subtotal + tax + delivery;

  const handleSubmitOrder = (e: React.FormEvent) => {
    e.preventDefault();
    
    const orderData = {
      items: cartItems.map(item => ({
        productId: item.id,
        quantity: item.quantity,
        price: item.price,
      })),
      totalPrice: total,
      description: orderDetails.description,
      address: orderDetails.address,
      phone: orderDetails.phone,
    };

    console.log('Order submitted:', orderData);
    alert('¡Orden creada exitosamente!');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <Link to="/products">
            <Button variant="ghost" className="gap-2 mb-4">
              <ArrowLeft className="size-4" />
              Volver a Productos
            </Button>
          </Link>
          <h1 className="text-4xl font-bold mb-2">Carrito de Compras</h1>
          <p className="text-muted-foreground">Revisa tu orden antes de confirmar</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-4">
            {cartItems.length === 0 ? (
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-12">
                  <ShoppingBag className="size-16 text-muted-foreground mb-4" />
                  <p className="text-lg text-muted-foreground mb-4">Tu carrito está vacío</p>
                  <Link to="/products">
                    <Button>Explorar Productos</Button>
                  </Link>
                </CardContent>
              </Card>
            ) : (
              <>
                {cartItems.map(item => (
                  <Card key={item.id}>
                    <CardContent className="p-4">
                      <div className="flex gap-4">
                        <div className="w-24 h-24 rounded-lg overflow-hidden bg-gray-200 shrink-0">
                          <img
                            src={item.image}
                            alt={item.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="flex-1">
                          <div className="flex justify-between items-start mb-2">
                            <div>
                              <h3 className="font-semibold text-lg">{item.name}</h3>
                              <p className="text-sm text-muted-foreground">
                                ${item.price.toFixed(2)} c/u
                              </p>
                            </div>
                            <Button
                              variant="ghost"
                              size="icon-sm"
                              onClick={() => removeItem(item.id)}
                              className="text-destructive hover:text-destructive"
                            >
                              <Trash2 className="size-4" />
                            </Button>
                          </div>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <Button
                                variant="outline"
                                size="icon-sm"
                                onClick={() => updateQuantity(item.id, -1)}
                              >
                                <Minus className="size-3" />
                              </Button>
                              <span className="w-12 text-center font-medium">
                                {item.quantity}
                              </span>
                              <Button
                                variant="outline"
                                size="icon-sm"
                                onClick={() => updateQuantity(item.id, 1)}
                              >
                                <Plus className="size-3" />
                              </Button>
                            </div>
                            <p className="font-bold text-lg">
                              ${(item.price * item.quantity).toFixed(2)}
                            </p>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </>
            )}
          </div>

          <div className="lg:col-span-1">
            <Card className="sticky top-4">
              <CardHeader>
                <CardTitle>Resumen de Orden</CardTitle>
                <CardDescription>Detalles de tu pedido</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span>${subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">IVA (12%)</span>
                    <span>${tax.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Delivery</span>
                    <span>${delivery.toFixed(2)}</span>
                  </div>
                  <div className="border-t pt-2 mt-2">
                    <div className="flex justify-between font-bold text-lg">
                      <span>Total</span>
                      <span className="text-primary">${total.toFixed(2)}</span>
                    </div>
                  </div>
                </div>

                <form onSubmit={handleSubmitOrder} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="description">Instrucciones especiales</Label>
                    <Input
                      id="description"
                      placeholder="Ej: Sin cebolla, extra salsa..."
                      value={orderDetails.description}
                      onChange={(e) =>
                        setOrderDetails({ ...orderDetails, description: e.target.value })
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="address">Dirección de entrega</Label>
                    <Input
                      id="address"
                      placeholder="Calle, número, ciudad"
                      value={orderDetails.address}
                      onChange={(e) =>
                        setOrderDetails({ ...orderDetails, address: e.target.value })
                      }
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Teléfono</Label>
                    <Input
                      id="phone"
                      type="tel"
                      placeholder="0999999999"
                      value={orderDetails.phone}
                      onChange={(e) =>
                        setOrderDetails({ ...orderDetails, phone: e.target.value })
                      }
                      required
                    />
                  </div>
                </form>
              </CardContent>
              <CardFooter>
                <Button
                  className="w-full gap-2"
                  size="lg"
                  onClick={handleSubmitOrder}
                  disabled={cartItems.length === 0}
                >
                  <ShoppingBag className="size-4" />
                  Confirmar Orden
                </Button>
              </CardFooter>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
