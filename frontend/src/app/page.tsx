'use client';

import React from 'react';
import { Layout } from '@/components/layout/layout';
import { KanbanBoard } from '@/components/kanban/kanbanBoard';

export default function Home() {
  return (
    <Layout>
      <KanbanBoard />
    </Layout>
  );
}
