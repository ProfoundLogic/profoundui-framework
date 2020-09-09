
     H**********************************************************************************************
     H*                                                                                            *
     H*   Description: CGIDEV2 with Profound UI integration example - Customer Inquiry             *
     H*                                                                                            *
     H**********************************************************************************************

     H DFTACTGRP(*NO) ACTGRP(*NEW)
     H BNDDIR('TEMPLATE2')

     D**********************************************************************************************
     D*                                                                                            *
     D* External Prototypes and Definitions                                                        *
     D*                                                                                            *
     D**********************************************************************************************

      * CGIDEV2
      /COPY QRPGLESRC,PROTOTYPEB
      /COPY QRPGLESRC,USEC

     D**********************************************************************************************
     D*                                                                                            *
     D* Global Variables                                                                           *
     D*                                                                                            *
     D**********************************************************************************************

     D CRLF            C                   Const(x'0D25')

     D Buffer          S          32767A   Varying
     D QueryString     S          32767A   Varying

     D CSID            S              7  0
     D CSNAME          S             50


     D**********************************************************************************************
     D*                                                                                            *
     D* Program Mainline                                                                           *
     D*                                                                                            *
     D**********************************************************************************************

      /Free

        // Parse browser input.
        ZhbGetInput(QueryString : qusec);
        Monitor;
          CSID = %Dec(ZhbGetVar('CSID') : 7 : 0);
        On-Error;
          CSID = 0;
        EndMon;

        // Get Customer Name
        CSNAME = '';
        Exec SQL SELECT CSNAME INTO :CSNAME FROM CUSTMASTP
                 WHERE CSID = :CSID FETCH FIRST ROW ONLY;

        // Write header -- you must have a content type header like this, at a minimum.
        Buffer = 'Content-Type: text/plain' + CRLF + CRLF;
        ExSr WriteOut;

        // Write out JSON response
        If ZhbGetVar('btnExit') <> '1';
          Buffer = '{ "view": "..\/custinq.json", "screen": "CUSTINQFMT", ' +
                   '"data": { "CSID": "' + %Char(CSID) + '", "CSNAME": "' +
                   %TrimR(CSNAME) + '" } }';
          ExSr WriteOut;
        EndIf;

        // Finish
        wrtsection('*fini');
        *InLr = *On;


        ////////////////////////////////////////////////////////////////////////
        //                                                                    //
        // WriteOut Subroutine                                                //
        //                                                                    //
        ////////////////////////////////////////////////////////////////////////

        BegSr WriteOut;

          wrtNoSection(%Addr(Buffer) + 2 : %Len(Buffer));

        EndSr;

      /End-Free


