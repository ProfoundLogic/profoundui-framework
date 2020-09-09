
     H**********************************************************************************************
     H*                                                                                            *
     H*   Description: CGIDEV2 with Profound UI integration example - Product Listing              *
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

     D PRID            S             10A
     D PRNAME          S             30A
     D PPRICE          S             11P 2
     D PSTOCK          S              7P 0
     D FirstRecord     S               N   Inz(*On)


     D**********************************************************************************************
     D*                                                                                            *
     D* Program Mainline                                                                           *
     D*                                                                                            *
     D**********************************************************************************************

      /Free

        // Parse browser input.
        ZhbGetInput(QueryString : qusec);

        // Write header -- you must have a content type header like this, at a minimum.
        Buffer = 'Content-Type: text/plain' + CRLF + CRLF;
        ExSr WriteOut;

        // Write out JSON response
        If ZhbGetVar('btnExit') <> '1';
          Buffer = '{ "view": "..\/prodlist.json", "screen": "PRODCTL", ' +
                   '"data": { "PRODSFL": [ ';
          ExSr WriteOut;

          Exec SQL DECLARE cursor1 SCROLL CURSOR FOR
            SELECT PRID, PRNAME, PPRICE, PSTOCK FROM PRODUCTSP;
          Exec SQL Open cursor1;
          Exec SQL Fetch cursor1 INTO :PRID, :PRNAME, :PPRICE, :PSTOCK;
          Dow (SQLCod <> 100) and (SQLCod >= 0);
            If Not FirstRecord;
              Buffer = ',';
              ExSr WriteOut;
            EndIf;
            FirstRecord = *Off;

            Buffer = '{ "PRID": "' + %TrimR(PRID) + '",' +
                       '"PRNAME": "' + %TrimR(PRNAME) + '",' +
                       '"PPRICE": "' + %Char(PPRICE) + '",' +
                       '"PSTOCK": "' + %Char(PSTOCK) + '"}';
            ExSr WriteOut;

            Exec SQL Fetch cursor1 INTO :PRID, :PRNAME, :PPRICE, :PSTOCK;
          EndDo;
          Exec SQL Close cursor1;

          Buffer = '] } }';
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


