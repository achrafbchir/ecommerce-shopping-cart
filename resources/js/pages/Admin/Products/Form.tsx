import { router, useForm } from '@inertiajs/react';
import { Upload } from 'lucide-react';
import { useRef, useState } from 'react';

import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface Product {
    id?: number;
    name: string;
    price: string;
    stock_quantity: number;
    image_url?: string;
    image_path?: string;
}

interface ProductFormProps {
    product?: Product;
    action: string;
    method: 'post' | 'put' | 'patch';
    submitLabel: string;
}

export default function ProductForm({
    product,
    action,
    method,
    submitLabel,
}: ProductFormProps) {
    const form = useForm({
        name: product?.name || '',
        price: product?.price || '',
        stock_quantity: product?.stock_quantity || 0,
        image_url: product?.image_url || '',
        image: null as File | null,
    });

    const [preview, setPreview] = useState<string | null>(
        product?.image_url || null
    );
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            form.setData('image', file);
            form.setData('image_url', ''); // Clear URL when uploading file

            // Create preview
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleRemoveImage = () => {
        form.setData('image', null);
        setPreview(null);
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        
        if (method === 'post') {
            form.post(action, {
                forceFormData: true,
                preserveScroll: true,
                onSuccess: () => {
                    router.visit('/admin/products');
                },
            });
        } else {
            form.put(action, {
                forceFormData: true,
                preserveScroll: true,
                onSuccess: () => {
                    router.visit('/admin/products');
                },
            });
        }
    };

    return (
        <form onSubmit={submit} encType="multipart/form-data">
            <div className="space-y-6">
                {/* Basic Information */}
                <Card>
                    <CardHeader>
                        <CardTitle>Basic Information</CardTitle>
                        <CardDescription>
                            Enter the product details
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="name">
                                Product Name <span className="text-destructive">*</span>
                            </Label>
                                <Input
                                    id="name"
                                    value={form.data.name}
                                    onChange={(e) => form.setData('name', e.target.value)}
                                    placeholder="Enter product name"
                                    required
                                />
                                {form.errors.name && (
                                    <p className="text-sm text-destructive">{form.errors.name}</p>
                                )}
                        </div>

                        <div className="grid gap-4 md:grid-cols-2">
                            <div className="space-y-2">
                                <Label htmlFor="price">
                                    Price <span className="text-destructive">*</span>
                                </Label>
                                <Input
                                    id="price"
                                    type="number"
                                    step="0.01"
                                    min="0"
                                    value={form.data.price}
                                    onChange={(e) => form.setData('price', e.target.value)}
                                    placeholder="0.00"
                                    required
                                />
                                {form.errors.price && (
                                    <p className="text-sm text-destructive">
                                        {form.errors.price}
                                    </p>
                                )}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="stock_quantity">
                                    Stock Quantity{' '}
                                    <span className="text-destructive">*</span>
                                </Label>
                                <Input
                                    id="stock_quantity"
                                    type="number"
                                    min="0"
                                    value={form.data.stock_quantity}
                                    onChange={(e) =>
                                        form.setData('stock_quantity', parseInt(e.target.value) || 0)
                                    }
                                    placeholder="0"
                                    required
                                />
                                {form.errors.stock_quantity && (
                                    <p className="text-sm text-destructive">
                                        {form.errors.stock_quantity}
                                    </p>
                                )}
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Product Image */}
                <Card>
                    <CardHeader>
                        <CardTitle>Product Image</CardTitle>
                        <CardDescription>
                            Upload an image or provide an image URL
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {/* Image Preview */}
                        {preview && (
                            <div className="relative inline-block">
                                <img
                                    src={preview}
                                    alt="Preview"
                                    className="h-48 w-48 rounded-lg object-cover"
                                />
                                <Button
                                    type="button"
                                    variant="destructive"
                                    size="icon"
                                    className="absolute -right-2 -top-2"
                                    onClick={handleRemoveImage}
                                >
                                    ×
                                </Button>
                            </div>
                        )}

                        <div className="space-y-4">
                            {/* Image Upload */}
                            <div className="space-y-2">
                                <Label htmlFor="image">Upload Image</Label>
                                <div className="flex items-center gap-4">
                                    <Input
                                        id="image"
                                        type="file"
                                        accept="image/*"
                                        ref={fileInputRef}
                                        onChange={handleImageChange}
                                        className="cursor-pointer"
                                    />
                                    <Button
                                        type="button"
                                        variant="outline"
                                        onClick={() => fileInputRef.current?.click()}
                                    >
                                        <Upload className="mr-2 size-4" />
                                        Choose File
                                    </Button>
                                </div>
                                {form.errors.image && (
                                    <p className="text-sm text-destructive">
                                        {form.errors.image}
                                    </p>
                                )}
                                <p className="text-xs text-muted-foreground">
                                    Accepted formats: JPEG, JPG, PNG, GIF, WEBP (Max 2MB)
                                </p>
                            </div>

                            {/* Image URL */}
                            <div className="space-y-2">
                                <Label htmlFor="image_url">Or Image URL</Label>
                                <Input
                                    id="image_url"
                                    type="url"
                                    value={form.data.image_url}
                                    onChange={(e) => {
                                        form.setData('image_url', e.target.value);
                                        form.setData('image', null);
                                        setPreview(e.target.value || null);
                                    }}
                                    placeholder="https://example.com/image.jpg"
                                />
                                {form.errors.image_url && (
                                    <p className="text-sm text-destructive">
                                        {form.errors.image_url}
                                    </p>
                                )}
                                <p className="text-xs text-muted-foreground">
                                    Provide a direct URL to the product image
                                </p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Actions */}
                <div className="flex justify-end gap-4">
                    <Button
                        type="button"
                        variant="outline"
                        onClick={() => window.history.back()}
                    >
                        Cancel
                    </Button>
                    <Button type="submit" disabled={form.processing}>
                        {form.processing ? 'Saving...' : submitLabel}
                    </Button>
                </div>
            </div>
        </form>
    );
}

