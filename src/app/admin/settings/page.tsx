

"use client";

import { useState, useEffect } from "react";
import { useForm, useFieldArray, Controller } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { useProducts } from "@/lib/products";
import { useCategories } from "@/lib/categories";
import { db } from "@/lib/firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { Loader2, ArrowUp, ArrowDown, Trash2 } from "lucide-react";
import type { Product, Category } from "@/types";
import { Combobox } from "@/components/ui/combobox";
import Image from "next/image";

const promoCodeSchema = z.object({
    code: z.string().min(1, "Code is required"),
    type: z.enum(["Percentage", "Fixed", "Free Delivery"]),
    value: z.number().min(0, "Value must be positive")
});

const formSchema = z.object({
  deliveryFee: z.coerce.number().min(0, "Delivery fee must be a positive number."),
  freeDeliveryThreshold: z.coerce.number().min(0, "Threshold must be a positive number."),
  promoCodes: z.array(promoCodeSchema),
  featuredProductIds: z.array(z.string()).max(8, "You can select a maximum of 8 products."),
  featuredCategoryIds: z.array(z.string()).max(5, "You can select a maximum of 5 categories."),
});

type FormData = z.infer<typeof formSchema>;

const ReorderableList = ({
    items,
    onRemove,
    onMove,
} : {
    items: (Product[] | Category[]),
    onRemove: (id: string) => void,
    onMove: (startIndex: number, endIndex: number) => void,
}) => {
    
    return (
        <div className="space-y-2 mt-4">
            {items.map((item, index) => (
                <div
                    key={item.id}
                    className="flex items-center gap-4 p-2 border rounded-lg bg-background"
                >
                    <span className="text-sm font-bold text-muted-foreground">#{index + 1}</span>
                    {item.imageUrl ? (
                        <Image src={item.imageUrl} alt={item.name} width={32} height={32} className="rounded-md object-cover"/>
                    ) : (
                        <div className="w-8 h-8 rounded-md bg-muted"></div>
                    )}
                    <span className="flex-grow font-medium text-sm">{item.name}</span>
                    <div className="flex gap-1">
                        <Button size="icon" variant="ghost" className="h-8 w-8" onClick={() => onMove(index, index - 1)} disabled={index === 0}>
                            <ArrowUp className="h-4 w-4"/>
                        </Button>
                            <Button size="icon" variant="ghost" className="h-8 w-8" onClick={() => onMove(index, index + 1)} disabled={index === items.length - 1}>
                            <ArrowDown className="h-4 w-4"/>
                        </Button>
                        <Button size="icon" variant="ghost" className="h-8 w-8 text-destructive hover:text-destructive" onClick={() => onRemove(item.id)}>
                            <Trash2 className="h-4 w-4"/>
                        </Button>
                    </div>
                </div>
            ))}
        </div>
    );
}

const promoCodeFormSchema = z.object({
    newCode: z.string().min(1, "Code is required."),
    newCodeType: z.enum(["Percentage", "Fixed", "Free Delivery"]),
    newCodeValue: z.coerce.number().min(0, "Value must be positive.")
});

export default function SettingsPage() {
  const { toast } = useToast();
  const { products, loading: productsLoading } = useProducts();
  const { categories, loading: categoriesLoading } = useCategories();
  const [isLoading, setIsLoading] = useState(false);
  const [pageLoading, setPageLoading] = useState(true);

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      deliveryFee: 0,
      freeDeliveryThreshold: 0,
      promoCodes: [],
      featuredProductIds: [],
      featuredCategoryIds: [],
    },
  });

  const promoForm = useForm<z.infer<typeof promoCodeFormSchema>>({
    resolver: zodResolver(promoCodeFormSchema),
    defaultValues: {
        newCode: "",
        newCodeType: "Percentage",
        newCodeValue: 0
    }
  });

  const { fields: productFields, append: appendProduct, remove: removeProduct, move: moveProduct, replace: replaceProducts } = useFieldArray({
      control: form.control,
      name: "featuredProductIds"
  });

  const { fields: categoryFields, append: appendCategory, remove: removeCategory, move: moveCategory } = useFieldArray({
      control: form.control,
      name: "featuredCategoryIds"
  });

  const { fields: promoCodeFields, append: appendPromoCode, remove: removePromoCode } = useFieldArray({
    control: form.control,
    name: "promoCodes"
  });

  useEffect(() => {
    const fetchSettings = async () => {
      setPageLoading(true);
      const docRef = doc(db, "site-settings", "store");
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        form.reset({
            ...docSnap.data(),
            featuredProductIds: [] // Always start with an empty list
        });
      } else {
        form.reset({
            deliveryFee: 0,
            freeDeliveryThreshold: 0,
            promoCodes: [],
            featuredProductIds: [],
            featuredCategoryIds: [],
        })
      }
      setPageLoading(false);
    };
    fetchSettings();
  }, [form]);

  async function onSubmit(values: FormData) {
    setIsLoading(true);
    try {
      const docRef = doc(db, "site-settings", "store");
      await setDoc(docRef, values, { merge: true });
      toast({
        title: "Settings Saved",
        description: "Your store settings have been updated.",
      });
    } catch (error) {
      console.error(error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to save settings.",
      });
    } finally {
      setIsLoading(false);
    }
  }

  const handleAddPromoCode = (values: z.infer<typeof promoCodeFormSchema>) => {
    appendPromoCode({
        code: values.newCode,
        type: values.newCodeType,
        value: values.newCodeType === "Free Delivery" ? 0 : values.newCodeValue,
    });
    promoForm.reset();
  }

  const loading = productsLoading || categoriesLoading || pageLoading;

  const productOptions = products
    .filter(p => !form.getValues("featuredProductIds").includes(p.id))
    .map(p => ({ label: p.name, value: p.id, imageUrl: p.imageUrls?.[0] }));

  const categoryOptions = categories
    .filter(c => !form.getValues("featuredCategoryIds").includes(c.id))
    .map(c => ({ label: c.name, value: c.id, imageUrl: c.imageUrl }));

  const selectedProducts = form.watch('featuredProductIds').map(id => products.find(p => p.id === id)).filter(Boolean) as Product[];
  const selectedCategories = form.watch('featuredCategoryIds').map(id => categories.find(c => c.id === id)).filter(Boolean) as Category[];

  const handleAddProduct = (id: string) => {
    if (!id || form.getValues('featuredProductIds').includes(id)) return;
    if (form.getValues('featuredProductIds').length < 8) {
        appendProduct(id);
    } else {
        toast({ variant: 'destructive', title: "Limit reached", description: "You can only feature up to 8 products."});
    }
  };
  
  const handleAddCategory = (id: string) => {
    if (!id || form.getValues('featuredCategoryIds').includes(id)) return;
    if (form.getValues('featuredCategoryIds').length < 5) {
        appendCategory(id);
    } else {
        toast({ variant: 'destructive', title: "Limit reached", description: "You can only feature up to 5 categories."});
    }
  };

  const handleRemoveProduct = (id: string) => {
    const index = form.getValues('featuredProductIds').findIndex(pId => pId === id);
    if(index > -1) removeProduct(index);
  }

  const handleRemoveCategory = (id: string) => {
    const index = form.getValues('featuredCategoryIds').findIndex(cId => cId === id);
    if(index > -1) removeCategory(index);
  }

  return (
    <div className="space-y-8">
      <header className="mb-8">
        <h1 className="text-3xl font-bold font-headline">Store Settings</h1>
        <p className="text-muted-foreground">Manage global settings for your store.</p>
      </header>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : (
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
                <div className="lg:col-span-2 space-y-8">
                    <Card>
                        <CardHeader>
                            <CardTitle>Delivery Settings</CardTitle>
                            <CardDescription>Manage delivery fees and promotions for your store.</CardDescription>
                        </CardHeader>
                        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <FormField
                                control={form.control}
                                name="deliveryFee"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Standard Delivery Fee (Rs)</FormLabel>
                                        <FormControl><Input type="number" {...field} /></FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                             <FormField
                                control={form.control}
                                name="freeDeliveryThreshold"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Free Delivery Threshold (Rs)</FormLabel>
                                        <FormControl><Input type="number" {...field} /></FormControl>
                                        <FormDescription>Minimum order total for free delivery. Set to 0 to disable.</FormDescription>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </CardContent>
                    </Card>
                </div>
                <div className="lg:col-span-1 space-y-8">
                     <Card>
                        <CardHeader>
                            <CardTitle>Promo Codes</CardTitle>
                            <CardDescription>Create and manage discount codes.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <Form {...promoForm}>
                                <div className="space-y-4">
                                     <FormField
                                        control={promoForm.control}
                                        name="newCode"
                                        render={({ field }) => (
                                            <FormItem><FormLabel>New Code</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                                        )}
                                    />
                                    <div className="grid grid-cols-2 gap-4">
                                         <FormField
                                            control={promoForm.control}
                                            name="newCodeType"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Type</FormLabel>
                                                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                        <FormControl><SelectTrigger><SelectValue /></SelectTrigger></FormControl>
                                                        <SelectContent>
                                                            <SelectItem value="Percentage">Percentage</SelectItem>
                                                            <SelectItem value="Fixed">Fixed</SelectItem>
                                                            <SelectItem value="Free Delivery">Free Delivery</SelectItem>
                                                        </SelectContent>
                                                    </Select>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                         <FormField
                                            control={promoForm.control}
                                            name="newCodeValue"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Discount</FormLabel>
                                                    <FormControl><Input type="number" disabled={promoForm.watch('newCodeType') === 'Free Delivery'} {...field} /></FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                    </div>
                                    <Button type="button" className="w-full" onClick={promoForm.handleSubmit(handleAddPromoCode)}>Add</Button>
                                </div>
                            </Form>
                            <div className="mt-6 space-y-2">
                                <h4 className="font-medium text-sm">Active Codes</h4>
                                {promoCodeFields.length === 0 ? (
                                    <p className="text-sm text-muted-foreground text-center py-4">No active codes.</p>
                                ) : (
                                    promoCodeFields.map((field, index) => (
                                        <div key={field.id} className="flex items-center justify-between p-2 border rounded-md bg-muted/50">
                                            <div className="font-mono text-sm">{form.getValues(`promoCodes.${index}.code`)}</div>
                                            <div className="text-sm text-muted-foreground">
                                                {form.getValues(`promoCodes.${index}.type`) === 'Percentage' && `${form.getValues(`promoCodes.${index}.value`)}% OFF`}
                                                {form.getValues(`promoCodes.${index}.type`) === 'Fixed' && `Rs ${form.getValues(`promoCodes.${index}.value`)} OFF`}
                                                {form.getValues(`promoCodes.${index}.type`) === 'Free Delivery' && 'Free Delivery'}
                                            </div>
                                            <Button size="icon" variant="ghost" className="h-7 w-7 text-destructive" onClick={() => removePromoCode(index)}>
                                                <Trash2 className="h-4 w-4"/>
                                            </Button>
                                        </div>
                                    ))
                                )}
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Homepage Settings</CardTitle>
                <CardDescription>Control content displayed on your storefront homepage.</CardDescription>
              </CardHeader>
              <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                    <h3 className="font-semibold mb-2">Featured Products</h3>
                    <p className="text-sm text-muted-foreground mb-4">Select up to 8 products to feature prominently. Use the arrows to reorder.</p>
                     <Combobox
                        options={productOptions}
                        onChange={handleAddProduct}
                        placeholder="Add a product..."
                        searchPlaceholder="Search products..."
                        notFoundText="No products found."
                    />
                    <ReorderableList
                        items={selectedProducts}
                        onRemove={handleRemoveProduct}
                        onMove={(from, to) => moveProduct(from, to)}
                    />
                </div>
                 <div>
                    <h3 className="font-semibold mb-2">Popular Categories</h3>
                    <p className="text-sm text-muted-foreground mb-4">Select up to 5 categories for the homepage grid. Use the arrows to reorder.</p>
                    <Combobox
                        options={categoryOptions}
                        onChange={handleAddCategory}
                        placeholder="Add a category..."
                        searchPlaceholder="Search categories..."
                        notFoundText="No categories found."
                    />
                    <ReorderableList
                        items={selectedCategories}
                        onRemove={handleRemoveCategory}
                        onMove={(from, to) => moveCategory(from, to)}
                    />
                </div>
              </CardContent>
            </Card>

            <Button type="submit" disabled={isLoading}>{isLoading ? "Saving..." : "Save All Settings"}</Button>
          </form>
        </Form>
      )}
    </div>
  );
}
