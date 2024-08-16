import React, { Suspense } from 'react';
import TravelPlanner from '../_components/planner/TravelPlanner';

const PlannerPage = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <TravelPlanner />
    </Suspense>
  );
};

export default PlannerPage;
