import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface StockBadgeProps {
    stockQuantity: number;
    lowStockThreshold?: number;
    className?: string;
}

export default function StockBadge({
    stockQuantity,
    lowStockThreshold = 10,
    className,
}: StockBadgeProps) {
    const isLowStock = stockQuantity <= lowStockThreshold;
    const isOutOfStock = stockQuantity === 0;

    if (isOutOfStock) {
        return (
            <Badge variant="destructive" className={cn(className)}>
                Out of Stock
            </Badge>
        );
    }

    if (isLowStock) {
        return (
            <Badge variant="destructive" className={cn(className)}>
                Low Stock ({stockQuantity})
            </Badge>
        );
    }

    return (
        <Badge variant="secondary" className={cn(className)}>
            In Stock ({stockQuantity})
        </Badge>
    );
}

