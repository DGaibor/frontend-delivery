
import { useState, type FormEvent, useEffect, useRef } from 'react';
import axios from 'axios';
import { PackagePlus } from 'lucide-react';

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Form, FormField } from '@/components/Form';
import { CustomButton } from '@/components/Button';
import { useNavigate } from 'react-router';

interface ProductFormData {
  name: string;
  description: string;
  price: string; // keep as string for the input, convert on submit
  image: string;
  category: string;
}

interface FormErrors {
  name?: string;
  description?: string;
  price?: string;
  image?: string;
  category?: string;
}

export const CreateProducts = () => {
  const API_URL = import.meta.env.VITE_HOST;
    const navigate = useNavigate();
  const fileInput = useRef(null);

  const [formData, setFormData] = useState<ProductFormData>({
    name: 'Pasta Carbonara',
    description: 'Creamy pasta with bacon, egg and parmesan cheese',
    price: '11.99',
    image: 'https://images.unsplash.com/photo-1612874742237-6526221588e3?w=400',
    category: 'Pasta',
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        const token =  localStorage.getItem('access_token')
        if (!token) {
            navigate('/login');
        }
    },[])

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'El nombre es requerido';
    } else if (formData.name.trim().length < 2) {
      newErrors.name = 'El nombre debe tener al menos 2 caracteres';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'La descripción es requerida';
    } else if (formData.description.trim().length < 10) {
      newErrors.description = 'La descripción debe tener al menos 10 caracteres';
    }

    if (!formData.price.trim()) {
      newErrors.price = 'El precio es requerido';
    } else {
      const priceNumber = Number(formData.price);
      if (Number.isNaN(priceNumber)) {
        newErrors.price = 'Ingresa un precio válido';
      } else if (priceNumber <= 0) {
        newErrors.price = 'El precio debe ser mayor a 0';
      }
    }

    // image is optional, but if provided it must be a valid URL
    if (formData.image.trim()) {
      try {
        // eslint-disable-next-line no-new
        new URL(formData.image.trim());
      } catch {
        newErrors.image = 'Ingresa una URL válida';
      }
    }

    if (!formData.category.trim()) {
      newErrors.category = 'La categoría es requerida';
    } else if (formData.category.trim().length < 2) {
      newErrors.category = 'La categoría debe tener al menos 2 caracteres';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    if (errors[name as keyof FormErrors]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsLoading(true);

    try {
      const form = new FormData();
      form.append('name', formData.name.trim());
        form.append('description', formData.description.trim());
        form.append('price', formData.price);
        form.append('category', formData.category.trim());
        if(fileInput && fileInput.current && fileInput.current.files && fileInput.current.files.length > 0){
          
          form.append('file', fileInput.current.files[0]);
        }
      console.log('Create product payload:', form);

      // // Cambia el endpoint si tu API usa otro
      const response = await axios.post(`${API_URL}/products`, form, {
        headers: {
            'Authorization': `Bearer ${localStorage.getItem('access_token')}`
        }
      });
      console.log(response);
      
      alert('Producto creado correctamente');

      setFormData({
        name: '',
        description: '',
        price: '',
        image: '',
        category: '',
      });
    } catch (error) {
      console.log('Create product error:', error);
      alert('Hubo un error creando el producto. Por favor, intenta de nuevo.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="mx-auto w-full max-w-xl p-6">
      <Card>
        <CardHeader className="text-center">
          <div className="mx-auto mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
            <PackagePlus className="size-6 text-primary" />
          </div>
          <CardTitle className="text-2xl">Crear producto</CardTitle>
          <CardDescription>Agrega un producto nuevo a tu menú</CardDescription>
        </CardHeader>

        <CardContent>
          <Form onSubmit={handleSubmit}>
            <FormField
              label="Nombre"
              name="name"
              type="text"
              placeholder="Pasta Carbonara"
              value={formData.name}
              onChange={handleChange}
              error={errors.name}
            />

            <FormField
              label="Descripción"
              name="description"
              type="text"
              placeholder="Describe el producto..."
              value={formData.description}
              onChange={handleChange}
              error={errors.description}
            />
           

            <FormField
              label="Precio"
              name="price"
              type="number"
              placeholder="11.99"
              value={formData.price}
              onChange={handleChange}
              error={errors.price}
            />

            <input type="file" ref={fileInput} />

            <FormField
              label="Imagen (URL - opcional)"
              name="image"
              type="text"
              placeholder="https://images.unsplash.com/..."
              value={formData.image}
              onChange={handleChange}
              error={errors.image}
            />

            <FormField
              label="Categoría"
              name="category"
              type="text"
              placeholder="Pasta"
              value={formData.category}
              onChange={handleChange}
              error={errors.category}
            />

            <CustomButton type="submit" isLoading={isLoading} size="lg">
              Crear producto
            </CustomButton>
          </Form>

          <div className="mt-6 rounded-md border p-4">
            <div className="mb-2 text-sm font-medium">Preview</div>

            {formData.image.trim() ? (
              <img
                src={formData.image}
                alt={formData.name || 'Product image'}
                className="mb-3 h-40 w-full rounded-md object-cover"
                loading="lazy"
              />
            ) : (
              <div className="mb-3 flex h-40 items-center justify-center rounded-md bg-muted text-sm text-muted-foreground">
                Sin imagen
              </div>
            )}

            <div className="text-lg font-semibold">{formData.name || '—'}</div>
            <div className="text-sm text-muted-foreground">{formData.category || '—'}</div>
            <div className="mt-2 text-sm">{formData.description || '—'}</div>
            <div className="mt-3 font-semibold">
              ${(() => {
                const n = Number(formData.price);
                return Number.isFinite(n) && formData.price.trim() ? n.toFixed(2) : '0.00';
              })()}
            </div>

            <pre className="mt-4 overflow-auto rounded-md bg-muted p-3 text-xs">
{JSON.stringify(
  {
    id: 4,
    name: formData.name,
    description: formData.description,
    price: formData.price ? Number(formData.price) : 0,
    image: formData.image,
    category: formData.category,
  },
  null,
  2
)}
            </pre>
          </div>
        </CardContent>

        <CardFooter className="justify-center">
          <p className="text-sm text-muted-foreground">Puedes conectar esto a tu backend con el endpoint <code className="rounded bg-muted px-1 py-0.5">/products</code>.</p>
        </CardFooter>
      </Card>
    </div>
  );
};
