import fastify from 'fastify';
import { appRoutes } from './http/Routes';

export const app = fastify();

app.register(appRoutes);