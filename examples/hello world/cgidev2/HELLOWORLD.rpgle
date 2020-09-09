
     H**********************************************************************************************
     H*                                                                                            *
     H*   Description: CGIDEV2 with Profound UI integration example - Hello World                  *
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

     D**********************************************************************************************
     D*                                                                                            *
     D* Program Mainline                                                                           *
     D*                                                                                            *
     D**********************************************************************************************

      /Free

        // Write header -- you must have a content type header like this, at a minimum.
        Buffer = 'Content-Type: text/plain' + CRLF + CRLF;
        ExSr WriteOut;

        // Write out JSON response
        Buffer = '{ "view": "..\/helloworld.json" }';
        ExSr WriteOut;

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


