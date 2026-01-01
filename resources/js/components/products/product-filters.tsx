import { index } from '@/routes/products';
import { router } from '@inertiajs/react';
import { Filter, X } from 'lucide-react';
import { useState } from 'react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';

interface ProductFiltersProps {
    filters: {
        search?: string;
        min_price?: string;
        max_price?: string;
        stock_status?: string;
        sort_by?: string;
    };
    priceRange: {
        min: number;
        max: number;
    };
}

export default function ProductFilters({
    filters,
    priceRange,
}: ProductFiltersProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [localFilters, setLocalFilters] = useState({
        min_price: filters.min_price || '',
        max_price: filters.max_price || '',
        stock_status: filters.stock_status || 'all',
        sort_by: filters.sort_by || 'latest',
    });

    // Convert empty stock_status to 'all' for Select component
    const stockStatusValue = localFilters.stock_status || 'all';

    const hasActiveFilters =
        localFilters.min_price ||
        localFilters.max_price ||
        (localFilters.stock_status && localFilters.stock_status !== 'all') ||
        localFilters.sort_by !== 'latest';

    const handleFilterChange = (key: string, value: string) => {
        const updatedFilters = { ...localFilters, [key]: value };
        setLocalFilters(updatedFilters);

        // Auto-apply sort changes on desktop
        if (key === 'sort_by' && window.innerWidth >= 1024) {
            const params: Record<string, string | undefined> = {
                search: filters.search,
                min_price: updatedFilters.min_price || undefined,
                max_price: updatedFilters.max_price || undefined,
                stock_status: updatedFilters.stock_status || undefined,
                sort_by: value === 'latest' ? undefined : value || undefined,
            };

            Object.keys(params).forEach(
                (k) => params[k] === undefined && delete params[k]
            );

            router.get(index().url, params, {
                preserveState: false,
                preserveScroll: false,
            });
        }
    };

    const handleApplyFilters = () => {
        const params: Record<string, string | undefined> = {
            search: filters.search,
            min_price: localFilters.min_price || undefined,
            max_price: localFilters.max_price || undefined,
            stock_status: localFilters.stock_status || undefined,
            sort_by: localFilters.sort_by === 'latest' ? undefined : localFilters.sort_by || undefined,
        };

        // Remove undefined values
        Object.keys(params).forEach(
            (key) => params[key] === undefined && delete params[key]
        );

        router.get(index().url, params, {
            preserveState: false,
            preserveScroll: false,
        });

        setIsOpen(false);
    };

    const handleClearFilters = () => {
        const params: Record<string, string | undefined> = {
            search: filters.search,
        };

        setLocalFilters({
            min_price: '',
            max_price: '',
            stock_status: 'all',
            sort_by: 'latest',
        });

        router.get(index().url, params, {
            preserveState: false,
            preserveScroll: false,
        });

        setIsOpen(false);
    };

    return (
        <div className="space-y-4">
            {/* Mobile Filter Toggle */}
            <div className="flex items-center justify-between lg:hidden">
                <Button
                    variant="outline"
                    onClick={() => setIsOpen(!isOpen)}
                    className="w-full"
                >
                    <Filter className="mr-2 size-4" />
                    Filters
                    {hasActiveFilters && (
                        <span className="ml-2 rounded-full bg-primary px-2 py-0.5 text-xs text-primary-foreground">
                            Active
                        </span>
                    )}
                </Button>
            </div>

            {/* Filter Panel */}
            <div
                className={`space-y-6 ${
                    isOpen ? 'block' : 'hidden'
                } lg:block rounded-lg border bg-card p-6`}
            >
                <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold">Filters</h3>
                    {hasActiveFilters && (
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={handleClearFilters}
                        >
                            <X className="mr-1 size-4" />
                            Clear
                        </Button>
                    )}
                </div>

                <Separator />

                {/* Sort By */}
                <div className="space-y-2">
                    <Label htmlFor="sort_by">Sort By</Label>
                    <Select
                        value={localFilters.sort_by}
                        onValueChange={(value) =>
                            handleFilterChange('sort_by', value)
                        }
                    >
                        <SelectTrigger id="sort_by">
                            <SelectValue placeholder="Sort by" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="latest">Latest First</SelectItem>
                            <SelectItem value="price_low">
                                Price: Low to High
                            </SelectItem>
                            <SelectItem value="price_high">
                                Price: High to Low
                            </SelectItem>
                            <SelectItem value="name_asc">
                                Name: A to Z
                            </SelectItem>
                            <SelectItem value="name_desc">
                                Name: Z to A
                            </SelectItem>
                            <SelectItem value="stock_high">
                                Stock: High to Low
                            </SelectItem>
                            <SelectItem value="stock_low">
                                Stock: Low to High
                            </SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                <Separator />

                {/* Price Range */}
                <div className="space-y-4">
                    <Label>Price Range</Label>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="min_price" className="text-sm">
                                Min Price ($)
                            </Label>
                            <Input
                                id="min_price"
                                type="number"
                                min={priceRange.min}
                                max={priceRange.max}
                                step="0.01"
                                placeholder={priceRange.min.toFixed(2)}
                                value={localFilters.min_price}
                                onChange={(e) =>
                                    handleFilterChange('min_price', e.target.value)
                                }
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="max_price" className="text-sm">
                                Max Price ($)
                            </Label>
                            <Input
                                id="max_price"
                                type="number"
                                min={priceRange.min}
                                max={priceRange.max}
                                step="0.01"
                                placeholder={priceRange.max.toFixed(2)}
                                value={localFilters.max_price}
                                onChange={(e) =>
                                    handleFilterChange('max_price', e.target.value)
                                }
                            />
                        </div>
                    </div>
                    <p className="text-xs text-muted-foreground">
                        Range: ${priceRange.min.toFixed(2)} - $
                        {priceRange.max.toFixed(2)}
                    </p>
                </div>

                <Separator />

                {/* Stock Status */}
                <div className="space-y-2">
                    <Label htmlFor="stock_status">Stock Status</Label>
                    <Select
                        value={stockStatusValue}
                        onValueChange={(value) =>
                            handleFilterChange('stock_status', value === 'all' ? '' : value)
                        }
                    >
                        <SelectTrigger id="stock_status">
                            <SelectValue placeholder="All stock statuses" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Stock Statuses</SelectItem>
                            <SelectItem value="in_stock">In Stock</SelectItem>
                            <SelectItem value="low_stock">Low Stock</SelectItem>
                            <SelectItem value="out_of_stock">
                                Out of Stock
                            </SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                {/* Apply Button (Mobile) */}
                <div className="flex gap-2 lg:hidden">
                    <Button
                        variant="outline"
                        onClick={() => setIsOpen(false)}
                        className="flex-1"
                    >
                        Cancel
                    </Button>
                    <Button onClick={handleApplyFilters} className="flex-1">
                        Apply Filters
                    </Button>
                </div>

                {/* Apply button for price/stock filters on desktop */}
                <div className="hidden lg:block">
                    {(localFilters.min_price ||
                        localFilters.max_price ||
                        localFilters.stock_status) && (
                        <Button onClick={handleApplyFilters} className="w-full">
                            Apply Filters
                        </Button>
                    )}
                </div>
            </div>
        </div>
    );
}

