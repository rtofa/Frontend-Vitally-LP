'use client';

import { useEffect, useState } from 'react';
import { getProduct } from '@/lib/services/products';
import type { ApiProduct } from '@/lib/api-types';

interface Props {
  productId: string;
}

export default function ProductJsonLd({ productId }: Props) {
  const [product, setProduct] = useState<ApiProduct | null>(null);

  useEffect(() => {
    let active = true;
    getProduct(productId)
      .then((data) => {
        if (active) setProduct(data);
      })
      .catch(() => {});
    return () => { active = false; };
  }, [productId]);

  if (!product) return null;

  const name = product.productName ?? product.name ?? 'Produto';
  const description = product.productDescription ?? product.description ?? '';
  const imageUrl = product.imageUrl || product.image || '';
  const categoryName =
    product.categoryName ??
    (typeof product.category === 'string' ? product.category : product.category?.name ?? '');

  const jsonLd: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name,
    description: description || `${name} — Equipamento de Academia Premium Vitally`,
    brand: {
      '@type': 'Brand',
      name: 'Vitally',
    },
    manufacturer: {
      '@type': 'Organization',
      name: 'Vitally Indústria de Aparelhos para Ginástica LTDA',
    },
    url: `https://vitallyoficial.com.br/shop/${productId}`,
  };

  if (imageUrl) {
    jsonLd.image = imageUrl;
  }

  if (categoryName) {
    jsonLd.category = categoryName;
  }

  // Only add offers if price is available
  if (product.price != null && Number.isFinite(product.price)) {
    jsonLd.offers = {
      '@type': 'Offer',
      price: product.price.toFixed(2),
      priceCurrency: 'BRL',
      availability: 'https://schema.org/InStock',
      seller: {
        '@type': 'Organization',
        name: 'Vitally',
      },
    };
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}
