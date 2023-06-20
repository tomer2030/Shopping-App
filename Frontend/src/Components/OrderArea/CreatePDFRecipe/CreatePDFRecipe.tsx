import React, { useEffect } from 'react';
import {Document, Page, Text, View, StyleSheet, PDFDownloadLink, BlobProvider, renderToString } from '@react-pdf/renderer';
import { saveAs } from 'file-saver';
import ProductCartModel from '../../../Models/ProductCartModel';
import UserModel from '../../../Models/UserModel';
import CreditCardModel from '../../../Models/CreditCardModel';
import ProductModel from '../../../Models/ProductModel';

interface MyPdfDocumentProps {
    productsListToBuy: ProductCartModel[];
    allProducts: ProductModel[];
    totalPrice: number;
    user: UserModel;
    paymentDetails: CreditCardModel;
}



function MyPdfDocument(props: MyPdfDocumentProps): JSX.Element {
    const styles = StyleSheet.create({
        page: {
            flexDirection: 'row',
            backgroundColor: '#E4E4E4',
        },
        section: {
            margin: 20,
            padding: 10,
            flexGrow: 1,
        },
        text: {
            marginBottom: 10,
        },
        table: {
            width: '100%',
            borderStyle: 'solid',
            borderWidth: 1,
            borderColor: '#000',
          },
          tableRow: {
            margin: 'auto',
            flexDirection: 'row',
          },
          tableCell: {
            margin: 'auto',
            marginTop: 5,
            marginBottom: 5,
            fontSize: 10,
            padding: '2px',
            textAlign: 'center',
          },
    });
    useEffect(()=>{
        
    },[])    

    const pdfContent = (
        <Document>
            <Page size="A4" style={styles.page}>
                <View style={styles.section}>
                    {props.productsListToBuy.length !== 0 && props.productsListToBuy.map((oneProduct => 
                        <Text key={oneProduct.productId} style={styles.text}>{props.allProducts.find(p => p.productId === oneProduct.productId).productName}</Text>
                    ))}
                </View>
            </Page>
        </Document>
    );
      
    return (
        <PDFDownloadLink document={pdfContent} fileName="example.pdf">
            {({ blob, url, loading, error }) =>
            loading ? 'Loading PDF...' : 'Download PDF'
            }
        </PDFDownloadLink>
    );
}

export default MyPdfDocument;
