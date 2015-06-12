
##Gibbs sampler demonstration

bvnGibbs <- function(B0, rho, R) {

	s <- 1 - rho^2

	out <- matrix(0, R, 2)
	
	out[1,2] <- rnorm(1, rho * B0[1], s)
	out[1,1] <- rnorm(1, rho * out[1,2], s) 
	
	
	for(i in 2:R) {
		
		out[i,2] <- rnorm(1, rho * out[(i-1), 1], s)
		out[i,1] <- rnorm(1, rho * out[i, 2], s)
	
	}
	
	out <- rbind(B0, out)
	colnames(out) <- c("theta1", "theta2")
	return(out)

}

system.time(
	gibbs <- bvnGibbs(c(2,-2), 0.9, 1000)
)

plot(gibbs, type="l")

##Contour plot
library(KernSmooth)
est <- bvnGibbs(c(0,0), 0.7, 100000)
plot(est)

fit <- bkde2D(as.matrix(est[-1,]), c(0.1, 0.1))
contour(fit$x1, fit$x2, fit$fhat, col="blue", xlim=c(-2,2), ylim=c(-2,2), frame.plot=FALSE)

##MCMC Pack
##Prep and Clean data
epa <- read.csv("vehicles_2015.csv")
cyl <- which(is.na(epa$cylinders) | epa$cylinders > 8 | epa$cylinders == 3 | epa$cylinders == 5)
length(cyl)

gas <- epa[-cyl,]
dim(gas)



x <- seq(0.02, 40.02, by=0.05)
s <- var(gas$fuel_cost/100)

ig1 <- dinvgamma(x, 0.001, 0.001)
ig2 <- dinvgamma(x, 2, s)

plot(x, ig1, type="l", col="blue", lwd=2, ylim=c(0,0.07), ylab="density")
lines(x, ig2, col="red", lwd=2)



library(MCMCpack)
library(coda)


f <- formula(gas$fuel_cost/100 ~ gas$mpg_combined + factor(gas$cylinders))


system.time(
  bayesreg <- MCMCregress(formula=f, burnin=2000, mcmc=20000, thin=2,
                          b0=0, B0=0.1, c0=2, d0=var(gas$fuel_cost/100))
)


dim(bayesreg)
head(bayesreg)

summary(bayesreg[,2])

plot(density(bayesreg[,2]), col="blue", lwd=3)

qqnorm(bayesreg[,5])
qqline(bayesreg[,5])

plot(density(gas$mpg_combined))


quantile(bayesreg[,2])



traceplot(bayesreg[,2])
densityplot(bayesreg[,2])
xyplot(bayesreg)

raftery.diag(bayesreg)


bayesregC <- MCMCregress(f, beta.start=0, burnin=0, mcmc=22000, thin=1)
str(bayesregC)

bayesregT <- mcmc(bayesregC[2001:22000,])

plot(bayesregC)
traceplot(bayesregT)


##CHECKING CONVERGENCE














