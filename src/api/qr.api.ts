import axios from 'axios';
import api from './axios';
import type { ApiResponse, CreateQRInput, PublicCardData, QRCard } from '../types/qr.types';

const publicApi = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:4000/api/v1',
  timeout: 15000,
});

export const qrApi = {
  create: (data: CreateQRInput) =>
    api.post<ApiResponse<QRCard>>('/qr', data).then((r) => r.data),

  getAll: () =>
    api.get<ApiResponse<QRCard[]>>('/qr').then((r) => r.data),

  getById: (id: string) =>
    api.get<ApiResponse<QRCard>>(`/qr/${id}`).then((r) => r.data),

  update: (id: string, data: Partial<CreateQRInput>) =>
    api.put<ApiResponse<QRCard>>(`/qr/${id}`, data).then((r) => r.data),

  toggleStatus: (id: string) =>
    api.put<ApiResponse<QRCard>>(`/qr/${id}/status`).then((r) => r.data),

  remove: (id: string) =>
    api.delete<ApiResponse<void>>(`/qr/${id}`).then((r) => r.data),

  getPublicBySlug: (slug: string) =>
    publicApi
      .get<ApiResponse<PublicCardData>>(`/qr/card/${slug}`)
      .then((r) => r.data),
};
