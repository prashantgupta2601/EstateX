import React from 'react';
import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';
import { Property } from '@/types/property';

const styles = StyleSheet.create({
  page: {
    padding: 40,
    fontSize: 11,
    fontFamily: 'Helvetica',
    color: '#333333',
    lineHeight: 1.5,
  },
  header: {
    borderBottomWidth: 2,
    borderBottomColor: '#1e3a8a',
    borderBottomStyle: 'solid',
    paddingBottom: 15,
    marginBottom: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1e293b',
    marginBottom: 5,
  },
  price: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1e3a8a',
  },
  subtitle: {
    fontSize: 10,
    color: '#64748b',
    marginTop: 3,
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#1e3a8a',
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
    borderBottomStyle: 'solid',
    paddingBottom: 4,
    marginBottom: 10,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderStyle: 'solid',
    borderRadius: 6,
  },
  gridCol: {
    width: '33.3%',
    padding: 8,
    borderRightWidth: 1,
    borderRightColor: '#e2e8f0',
    borderRightStyle: 'solid',
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
    borderBottomStyle: 'solid',
  },
  gridLabel: {
    fontSize: 8,
    color: '#64748b',
    textTransform: 'uppercase',
  },
  gridValue: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#1e293b',
    marginTop: 2,
  },
  description: {
    fontSize: 9.5,
    color: '#475569',
    textAlign: 'justify',
  },
  amenitiesList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  amenityBadge: {
    backgroundColor: '#f1f5f9',
    paddingHorizontal: 8,
    paddingVertical: 4,
    marginRight: 6,
    marginBottom: 6,
    borderRadius: 4,
    fontSize: 8.5,
    color: '#475569',
  },
  agentCard: {
    backgroundColor: '#f8fafc',
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderStyle: 'solid',
    marginTop: 10,
  },
  agentName: {
    fontSize: 11,
    fontWeight: 'bold',
    color: '#1e293b',
  },
  agentInfo: {
    fontSize: 8.5,
    color: '#64748b',
    marginTop: 2,
  },
  footer: {
    position: 'absolute',
    bottom: 30,
    left: 40,
    right: 40,
    borderTopWidth: 1,
    borderTopColor: '#e2e8f0',
    borderTopStyle: 'solid',
    paddingTop: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    fontSize: 8,
    color: '#94a3b8',
  },
});

interface PropertyBrochureProps {
  property: Property;
}

export default function PropertyBrochure({ property }: PropertyBrochureProps) {
  const formatPrice = (price: number) => {
    if (price >= 10000000) {
      return `Rs. ${(price / 10000000).toFixed(2)} Crore`;
    }
    if (price >= 100000) {
      return `Rs. ${(price / 100000).toFixed(1)} Lakh`;
    }
    return `Rs. ${price.toLocaleString('en-IN')}`;
  };

  const formattedPrice = formatPrice(property.price) + (property.type === 'rent' ? ' / month' : '');

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>{property.title}</Text>
          <Text style={styles.price}>{formattedPrice}</Text>
          <Text style={styles.subtitle}>
            {property.location.address}, {property.location.city}, {property.location.state} {property.location.zipCode}
          </Text>
        </View>

        {/* Specifications Grid */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Property Specifications</Text>
          <View style={styles.grid}>
            <View style={styles.gridCol}>
              <Text style={styles.gridLabel}>Bedrooms</Text>
              <Text style={styles.gridValue}>{property.bedrooms > 0 ? `${property.bedrooms} BHK` : 'N/A'}</Text>
            </View>
            <View style={styles.gridCol}>
              <Text style={styles.gridLabel}>Bathrooms</Text>
              <Text style={styles.gridValue}>{property.bathrooms > 0 ? `${property.bathrooms} Baths` : 'N/A'}</Text>
            </View>
            <View style={[styles.gridCol, { borderRightWidth: 0 }]}>
              <Text style={styles.gridLabel}>Super Area</Text>
              <Text style={styles.gridValue}>{property.area} {property.areaUnit || 'sqft'}</Text>
            </View>
            <View style={[styles.gridCol, { borderBottomWidth: 0 }]}>
              <Text style={styles.gridLabel}>Floor</Text>
              <Text style={styles.gridValue}>
                {property.floor && property.totalFloors 
                  ? `${property.floor} of ${property.totalFloors}` 
                  : 'Ground Floor'}
              </Text>
            </View>
            <View style={[styles.gridCol, { borderBottomWidth: 0 }]}>
              <Text style={styles.gridLabel}>Property Age</Text>
              <Text style={styles.gridValue}>
                {property.yearBuilt ? `${new Date().getFullYear() - property.yearBuilt} Years` : 'New'}
              </Text>
            </View>
            <View style={[styles.gridCol, { borderBottomWidth: 0, borderRightWidth: 0 }]}>
              <Text style={styles.gridLabel}>Furnishing</Text>
              <Text style={styles.gridValue}>{property.furnishingStatus || 'Unfurnished'}</Text>
            </View>
          </View>
        </View>

        {/* About Property */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>About this Property</Text>
          <Text style={styles.description}>{property.description}</Text>
        </View>

        {/* Amenities */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Amenities</Text>
          <View style={styles.amenitiesList}>
            {property.amenities.map((amenity) => (
              <Text key={amenity.id} style={styles.amenityBadge}>
                {amenity.name}
              </Text>
            ))}
          </View>
        </View>

        {/* Contact Info */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Seller Information</Text>
          <View style={styles.agentCard}>
            <Text style={styles.agentName}>{property.agent.name}</Text>
            <Text style={styles.agentInfo}>Role: {property.agent.role === 'owner' ? 'Owner' : 'Real Estate Broker'}</Text>
            <Text style={styles.agentInfo}>Phone: {property.agent.phone}</Text>
            <Text style={styles.agentInfo}>Email: {property.agent.email}</Text>
          </View>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text>Generated via EstateX Portal</Text>
          <Text>{new Date().toLocaleDateString('en-IN')}</Text>
        </View>
      </Page>
    </Document>
  );
}
