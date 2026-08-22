import React from 'react';
import { TourPackageCard, PackageCardProps } from './TourPackageCard';

export type { PackageCardProps };
export const PackageCard: React.FC<PackageCardProps> = (props) => <TourPackageCard {...props} />;
export default PackageCard;
