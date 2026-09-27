import type { ReactNode } from 'react';
import { css } from 'styled-system/css';
import { Flex } from 'styled-system/jsx';

interface PageHeaderProps {
  title: string;
  description?: string;
  actions?: ReactNode;
}

export function PageHeader({ title, description, actions }: PageHeaderProps) {
  return (
    <Flex justify="space-between" align="flex-start" wrap="wrap" gap="4" mb="6">
      <div>
        <h1 className={css({ textStyle: 'h1' })}>{title}</h1>
        {description && <p className={css({ textStyle: 'bodySm', color: 'text.muted', mt: '1' })}>{description}</p>}
      </div>
      {actions && <Flex gap="2">{actions}</Flex>}
    </Flex>
  );
}
