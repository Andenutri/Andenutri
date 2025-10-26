'use client';

import KanbanBoard from './KanbanBoard';

export default function TrelloView({ sidebarOpen }: { sidebarOpen: boolean }) {
  return <KanbanBoard sidebarOpen={sidebarOpen} />;
}

