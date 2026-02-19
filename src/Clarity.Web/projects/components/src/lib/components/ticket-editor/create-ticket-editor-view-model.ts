// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

import { inject } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { FormControl, UntypedFormGroup, Validators } from "@angular/forms";
import { BehaviorSubject, combineLatest, map, switchMap, Subject, tap, of, merge, startWith, EMPTY, catchError, exhaustMap, withLatestFrom } from "rxjs";
import { BoardStateService, DigitalAsset, DigitalAssetService, InitiativeService, TeamMemberService, Ticket, TicketService } from "@api";
import { TicketStore } from "../../stores";
import { PRIORITY_OPTIONS } from "../create-ticket";

export const TICKET_TYPE_OPTIONS = [
  { value: 0, label: 'Story' },
  { value: 1, label: 'Chore' }
];

export function createTicketEditorViewModel() {
  const route = inject(ActivatedRoute);
  const router = inject(Router);
  const ticketService = inject(TicketService);
  const ticketStore = inject(TicketStore);
  const boardStateService = inject(BoardStateService);
  const teamMemberService = inject(TeamMemberService);
  const initiativeService = inject(InitiativeService);
  const digitalAssetService = inject(DigitalAssetService);

  const ticketId = route.snapshot.paramMap.get('ticketId')!;

  const saveSubject = new Subject<void>();
  const deleteSubject = new Subject<void>();
  const uploadSubject = new Subject<File>();
  const detachSubject = new Subject<string>();
  const attachmentsSubject = new BehaviorSubject<DigitalAsset[]>([]);
  const savingSubject = new BehaviorSubject<boolean>(false);
  const savedSubject = new BehaviorSubject<boolean>(false);

  const ticket$ = ticketService.getById({ ticketId });

  return combineLatest([
    ticket$,
    boardStateService.get(),
    teamMemberService.get(),
    initiativeService.get()
  ]).pipe(
    switchMap(([ticket, states, teamMembers, initiatives]) => {
      attachmentsSubject.next(ticket.digitalAssets || []);

      const form = new UntypedFormGroup({
        name: new FormControl(ticket.name, [Validators.required]),
        description: new FormControl(ticket.description),
        acceptanceCriteria: new FormControl(ticket.acceptanceCriteria),
        url: new FormControl(ticket.url),
        state: new FormControl(Number(ticket.state), [Validators.required]),
        priority: new FormControl(ticket.priority || 0),
        storyPoints: new FormControl(ticket.storyPoints || 0),
        effort: new FormControl(ticket.effort || 0),
        ticketType: new FormControl(ticket.ticketType || 0),
        teamMemberId: new FormControl(ticket.teamMemberId || null),
        initiativeId: new FormControl(ticket.initiativeId || null)
      });

      const save$ = saveSubject.pipe(
        tap(() => {
          savingSubject.next(true);
          savedSubject.next(false);
        }),
        exhaustMap(() => ticketService.update({ ticket: { ...ticket, ...form.value } as Ticket }).pipe(
          tap(() => {
            savingSubject.next(false);
            savedSubject.next(true);
            setTimeout(() => savedSubject.next(false), 2000);
          }),
          catchError(() => {
            savingSubject.next(false);
            return of(null);
          })
        ))
      );

      const delete$ = deleteSubject.pipe(
        tap(() => {
          ticketStore.delete(ticket);
          router.navigate(['/my-tickets']);
        })
      );

      const upload$ = uploadSubject.pipe(
        exhaustMap((file) => digitalAssetService.upload({ file }).pipe(
          switchMap(({ digitalAssetId }) => ticketService.attachFile({ ticketId: ticket.ticketId, digitalAssetId }).pipe(
            switchMap(() => digitalAssetService.getById({ digitalAssetId })),
            tap((asset) => {
              const current = attachmentsSubject.value;
              attachmentsSubject.next([...current, asset]);
            })
          )),
          catchError(() => of(null))
        ))
      );

      const detach$ = detachSubject.pipe(
        exhaustMap((digitalAssetId) => ticketService.detachFile({ ticketId: ticket.ticketId, digitalAssetId }).pipe(
          tap(() => {
            const current = attachmentsSubject.value;
            attachmentsSubject.next(current.filter(a => a.digitalAssetId !== digitalAssetId));
          }),
          catchError(() => of(null))
        ))
      );

      const actions$ = merge(save$, delete$, upload$, detach$).pipe(startWith(EMPTY));

      return combineLatest([attachmentsSubject, savingSubject, savedSubject, actions$]).pipe(
        map(([attachments, saving, saved]) => ({
          ticket,
          form,
          states,
          teamMembers,
          initiatives,
          attachments,
          saving,
          saved,
          priorities: PRIORITY_OPTIONS,
          ticketTypes: TICKET_TYPE_OPTIONS,
          save: () => saveSubject.next(),
          delete: () => deleteSubject.next(),
          back: () => router.navigate(['/my-tickets']),
          uploadFile: (event: Event) => {
            const input = event.target as HTMLInputElement;
            if (input.files?.length) {
              uploadSubject.next(input.files[0]);
              input.value = '';
            }
          },
          detachFile: (digitalAssetId: string) => detachSubject.next(digitalAssetId),
          downloadFile: (digitalAssetId: string) => window.open(digitalAssetService.getServeUrl(digitalAssetId), '_blank'),
          getFileIcon: (contentType: string) => {
            if (contentType?.startsWith('image/')) return 'image';
            if (contentType?.includes('pdf')) return 'picture_as_pdf';
            if (contentType?.startsWith('text/') || contentType?.includes('json') || contentType?.includes('xml') || contentType?.includes('javascript')) return 'code';
            return 'description';
          },
          getFileIconColor: (contentType: string) => {
            if (contentType?.startsWith('image/')) return '#10B981';
            if (contentType?.includes('pdf')) return '#EF4444';
            if (contentType?.startsWith('text/') || contentType?.includes('json')) return '#7D00FA';
            return '#6B7280';
          }
        }))
      );
    })
  );
}
