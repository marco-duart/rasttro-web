import { http } from '../../api/http';
import { createNovidadesTracker, novidadesFrom, type Novidade, type NovidadeEvent } from './novidades';

export type NovidadesPlacement = 'web.dashboard' | 'web.novidades';

function sendEvents(events: NovidadeEvent[]) {
  // keepalive: o envio sobrevive à troca de página.
  void http
    .post('/novidades/events', { events }, { adapter: 'fetch', fetchOptions: { keepalive: true } })
    .catch(() => undefined);
}

const tracker = createNovidadesTracker(sendEvents);
let flushTimer: ReturnType<typeof setTimeout> | undefined;

export const novidadesApi = {
  /** Erro ou painel fora = lista vazia; Novidades nunca mostra erro. */
  list: (placement: NovidadesPlacement): Promise<Novidade[]> =>
    http
      .get('/novidades', { params: { placement } })
      .then((r) => novidadesFrom(r.data))
      .catch(() => []),

  impression: (announcementId: string, placement: NovidadesPlacement) => {
    if (!tracker.impression(announcementId, placement) || flushTimer) return;
    flushTimer = setTimeout(() => {
      flushTimer = undefined;
      tracker.flush();
    }, 2_000);
  },

  click: (announcementId: string, placement: NovidadesPlacement) => {
    tracker.click(announcementId, placement);
    tracker.flush();
  },
};
