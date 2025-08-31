import { map, mergeMap, filter } from 'rxjs'
import { FetchMessageObject } from 'imapflow'
import { emailObserver$ } from './lib/emailObserver'
import { simpleParser } from 'mailparser'
import { convertToMailObject, sendToEmailApi } from './lib/emailApi'

void (() => {
  emailObserver$
    .pipe(
      filter((email: FetchMessageObject): email is FetchMessageObject & { source: Buffer | string } => !!email.source),
      mergeMap((email: FetchMessageObject & { source: Buffer | string }) =>
        simpleParser(email.source.toString())
      ),
      map(convertToMailObject),
      mergeMap(sendToEmailApi)
    )
    .subscribe()
})()
