import { useState, type FormEvent } from "react";
import { Link } from "react-router";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Form, FormField } from "@/components/Form";
import { CustomButton } from "@/components/Button";
import { UtensilsCrossed } from "lucide-react";
import "./Register.css";
import axios from 'axios';


interface RegisterFormData {
  email: string;
  password: string;
  firstname: string;
  lastname: string;
  birthdate: string;
}

interface FormErrors {
  email?: string;
  password?: string;
  firstname?: string;
  lastname?: string;
  birthdate?: string;
}

export const RegisterPage = () => {
  const API_URL = import.meta.env.VITE_HOST;
  const [formData, setFormData] = useState<RegisterFormData>({
    email: "",
    password: "",
    firstname: "",
    lastname: "",
    birthdate: "",
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [isLoading, setIsLoading] = useState(false);

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.email) {
      newErrors.email = "El email es requerido";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Ingresa un email válido";
    }

    if (!formData.password) {
      newErrors.password = "La contraseña es requerida";
    } else if (formData.password.length < 6) {
      newErrors.password = "La contraseña debe tener al menos 6 caracteres";
    }

    if (!formData.firstname) {
      newErrors.firstname = "El nombre es requerido";
    }

    if (!formData.lastname) {
      newErrors.lastname = "El apellido es requerido";
    }

    if (!formData.birthdate) {
      newErrors.birthdate = "La fecha de nacimiento es requerida";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
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
      console.log("Register data:", formData);
      
      const response = await axios.post(`${API_URL}/users`,{
        name: formData.firstname,
        email: formData.email,
        password: formData.password,
        birthDate: formatBirthDate(formData.birthdate),
      } )
      console.log(response.data)
      alert(response.data);
    } catch (error) {
      console.log("Registration error:", error);
      alert("huvo un error durante el registro. Por favor, intenta de nuevo.");
    } finally {
      setIsLoading(false);
    }
  };
  function formatBirthDate(date: string): string {
    return new Date(`${date}T00:00:00.000Z`).toISOString();
  }

  return (
    <div className="register-container">
      <Card className="register-card">
        <CardHeader className="text-center">
          <div className="register-logo">
            <UtensilsCrossed className="size-10 text-primary" />
          </div>
          <CardTitle className="text-2xl">Crear cuenta</CardTitle>
          <CardDescription>
            Regístrate para empezar a pedir tu comida favorita
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <FormField
                label="Nombre"
                name="firstname"
                type="text"
                placeholder="Juan"
                value={formData.firstname}
                onChange={handleChange}
                error={errors.firstname}
              />
              <FormField
                label="Apellido"
                name="lastname"
                type="text"
                placeholder="Pérez"
                value={formData.lastname}
                onChange={handleChange}
                error={errors.lastname}
              />
            </div>
            <FormField
              label="Email"
              name="email"
              type="email"
              placeholder="tu@email.com"
              value={formData.email}
              onChange={handleChange}
              error={errors.email}
            />
            <FormField
              label="Contraseña"
              name="password"
              type="password"
              placeholder="••••••••"
              value={formData.password}
              onChange={handleChange}
              error={errors.password}
            />
            <FormField
              label="Fecha de nacimiento"
              name="birthdate"
              type="date"
              value={formData.birthdate}
              onChange={handleChange}
              error={errors.birthdate}
            />
            <CustomButton type="submit" isLoading={isLoading} size="lg">
              Registrarse
            </CustomButton>
          </Form>
        </CardContent>
        <CardFooter className="justify-center">
          <p className="text-sm text-muted-foreground">
            ¿Ya tienes cuenta?{" "}
            <Link to="/login" className="text-primary hover:underline font-medium">
              Inicia sesión
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
};
