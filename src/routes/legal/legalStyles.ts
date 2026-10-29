import { css } from 'styled-system/css';

export const CONTACT_EMAIL = 'maaxis.tech@gmail.com';

export const legalText = css({ textStyle: 'body', color: 'text.muted' });
export const legalList = css({ textStyle: 'body', color: 'text.muted', pl: '5', listStyle: 'disc', display: 'flex', flexDirection: 'column', gap: '2' });
export const legalLink = css({ color: 'brand', fontWeight: '600', _hover: { textDecoration: 'underline' } });
