import { type TreeDataItem } from '@/components/ui/tree-view';

export const data: TreeDataItem[] = [
  {
    id: '1',
    name: 'Folder 1',
    droppable: true,
    children: [
      {
        id: '2',
        name: 'Folder 1.1',
        droppable: true,
        children: [
          {
            id: '3',
            name: 'Page 1.1.1',
          },
          {
            id: '4',
            name: 'Page 1.1.2',
          },
        ],
      },
      {
        id: '5',
        name: 'Page 1.2 (disabled)',
        disabled: true
      },
    ],
  },
  {
    id: '6',
    name: 'Page 2 (draggable)',
    draggable: true
  },
];