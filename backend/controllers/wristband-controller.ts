import { Request, Response, NextFunction } from 'express';

import * as wristbandService from '../services/wristband-service';
import { bearerToken, getValueForDeletableField } from '../utils/util';
import { reqValidation, emailExists, hasConstraintsViolations } from '../utils/validation';

export async function getUser(req: Request, res: Response, next: NextFunction) {
  const { userId } = req.session;

  try {
    /* WRISTBAND_TOUCHPOINT - RESOURCE API */
    const user = await wristbandService.getUser(userId!, bearerToken(req));
    return res.status(200).json(user);
  } catch (error) {
    return next(error);
  }
}

export async function getRole(req: Request, res: Response, next: NextFunction) {
  const { userId } = req.session;

  try {
    /* WRISTBAND_TOUCHPOINT - RESOURCE API */
    const assignedRole = await wristbandService.getAssignedRole(userId!, bearerToken(req));
    return res.status(200).json(assignedRole);
  } catch (error) {
    return next(error);
  }
}

export async function getTenant(req: Request, res: Response, next: NextFunction) {
  const { tenantId } = req.session;

  try {
    /* WRISTBAND_TOUCHPOINT - RESOURCE API */
    const company = await wristbandService.getTenant(tenantId!, bearerToken(req));
    return res.status(200).json(company);
  } catch (error) {
    return next(error);
  }
}

export async function queryTenantRoles(req: Request, res: Response, next: NextFunction) {
  const { tenantId } = req.session;

  try {
    /* WRISTBAND_TOUCHPOINT - RESOURCE API */
    const assignableRoleOptions = await wristbandService.getAssignableRoleOptions(tenantId!, bearerToken(req));
    return res.status(200).json({ assignableRoleOptions });
  } catch (error) {
    return next(error);
  }
}

export async function updateUser(req: Request, res: Response, next: NextFunction) {
  try {
    reqValidation(req);
  } catch (error: any) {
    return res.status(400).json(error.data);
  }

  const { userId } = req.params;
  const userData = {
    givenName: getValueForDeletableField(req.body.givenName),
    familyName: getValueForDeletableField(req.body.familyName),
  };

  try {
    /* WRISTBAND_TOUCHPOINT - RESOURCE API */
    const user = await wristbandService.updateUser(userId, userData, bearerToken(req));
    return res.status(200).json(user);
  } catch (error: any) {
    if (error.response && error.response.status === 404) {
      return res.status(404).send();
    }

    return next(error);
  }
}

export async function queryNewUserInvitations(req: Request, res: Response, next: NextFunction) {
  const { tenantId } = req.session;

  try {
    /* WRISTBAND_TOUCHPOINT - RESOURCE API */
    const queryResults = await wristbandService.getNewUserInviteRequestsForTenant(tenantId!, bearerToken(req));
    return res.status(200).json(queryResults);
  } catch (error: any) {
    if (error.response && error.response.status === 404) {
      return res.status(404).send();
    }

    return next(error);
  }
}

export async function inviteNewUser(req: Request, res: Response, next: NextFunction) {
  try {
    reqValidation(req);
  } catch (error: any) {
    return res.status(400).json(error.data);
  }

  const { email, roleId } = req.body;
  const { tenantId } = req.session;

  try {
    /* WRISTBAND_TOUCHPOINT - RESOURCE API */
    await wristbandService.inviteNewUser(tenantId!, email, roleId, bearerToken(req));
    return res.status(204).send();
  } catch (error: any) {
    if (hasConstraintsViolations(error.response) && emailExists(error.response.data)) {
      return res.status(400).json({ code: 'INVALID_REQUEST', message: 'The email address already exists.' });
    }

    return next(error);
  }
}

export async function cancelNewUserInvite(req: Request, res: Response, next: NextFunction) {
  try {
    reqValidation(req);
  } catch (error: any) {
    return res.status(400).json(error.data);
  }

  const { requestId } = req.body;

  try {
    /* WRISTBAND_TOUCHPOINT - RESOURCE API */
    await wristbandService.cancelNewUserInvite(requestId, bearerToken(req));
    return res.status(204).send();
  } catch (error) {
    return next(error);
  }
}
